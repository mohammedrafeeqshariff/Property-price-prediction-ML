import socket
import threading

clients = {}  # socket -> username

def broadcast(message, sender_socket=None):
    for client in clients:
        if client != sender_socket:
            try:
                client.send(message.encode())
            except:
                client.close()
                remove_client(client)

def remove_client(client_socket):
    if client_socket in clients:
        username = clients[client_socket]
        print(f"{username} disconnected")
        del clients[client_socket]
        broadcast(f"{username} left the chat.")

def handle_client(client_socket):
    try:
        username = client_socket.recv(1024).decode()
        clients[client_socket] = username
        print(f"{username} joined the chat")

        broadcast(f"{username} joined the chat.")

        while True:
            message = client_socket.recv(1024).decode()
            if not message or message.lower() == 'bye':
                break
            broadcast(f"{username}: {message}", client_socket)

    except:
        pass
    finally:
        remove_client(client_socket)
        client_socket.close()

def server_program():
    host = socket.gethostname()
    port = 5000

    server_socket = socket.socket()
    server_socket.bind((host, port))
    server_socket.listen()

    print(f"Chat server started on {host}:{port}")

    while True:
        client_socket, address = server_socket.accept()
        print(f"Connection from {address}")

        thread = threading.Thread(
            target=handle_client,
            args=(client_socket,)
        )
        thread.start()

if __name__ == '__main__':
    server_program()
