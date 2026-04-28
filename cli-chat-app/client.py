import socket
import threading

def receive_messages(client):
    while True:
        try:
            data = client.recv(1024).decode()
            if not data:
                break
            print(data)
        except:
            break

def send_messages(client):
    while True:
        msg = input()
        if msg.lower() == 'bye':
            client.send(msg.encode())
            break
        client.send(msg.encode())

def client_program():
    host = socket.gethostname()
    port = 5000

    client_socket = socket.socket()
    client_socket.connect((host, port))

    recv_thread = threading.Thread(target=receive_messages, args=(client_socket,))
    send_thread = threading.Thread(target=send_messages, args=(client_socket,))

    recv_thread.start()
    send_thread.start()

    recv_thread.join()
    send_thread.join()

    client_socket.close()

if __name__ == '__main__':
    client_program()
