#include <iostream>
#include <vector>
#include <limits>
using namespace std;

//This class ensures Open/Closed Principle(OCP).
// Base class: Person
//This class creates virtual function to override fro base class, causing the objects of derieved class substitute base class objects.
// Implemented Liskov's Substitution principle.
class Person {
protected:
    string name;
    string email;

public:
    Person(string name = "Unknown", string email = "None") : name(name), email(email) {}
    //"const" keyword is used here to ensure the compiler that the function will not make any changes to the class members. 
    string getName() const { return name; }
    string getEmail() const { return email; }

    virtual void displayPrivileges(){      
        cout << "Show previlidges!!!\n";
    }

};

// Derived class: User (Single Inheritance from Person)
class User : public Person {
protected:
    string username, password;

public:
    static int totalUsers;

    // default constructor
     User() : Person(), username("Unknown"), password("None") {}

    // Constructor with email
    User(string username, string password, string name, string email)
        : Person(name, email), username(username), password(password) {
    }

    //***->Constructor Overloading<-***
    // Overloaded constructor without email
    User(string username, string password, string name)
        : Person(name, "None"), username(username), password(password) {
        totalUsers++;
    }

    string getUsername() const {
        return username;
    }
    string getPassword() const {
        return password;
    }

    static int getTotalUsers() {
        return totalUsers;
    }

    void displayPrivileges() override {      
        cout << "Privileges: Can login, view personal information.\n";
    }
};

int User::totalUsers = 0;

// Derived class: Admin (Multilevel Inheritance from User)
class Admin : public User{
public: 
    Admin(string username, string password, string name, string email)
        : User(username, password, name, email) {}

    void displayPrivileges() override {
        cout << "Privileges: Can manage users, view logs, and perform administrative tasks.\n";
    }

    void viewUsers(const vector<User>& users) {
        cout << "Total users: " << User::getTotalUsers() << endl;
        for (const auto& user : users) {
            cout << "User: " << user.getUsername() << ", Name: " << user.getName()
                 << ", Email: " << user.getEmail() << endl;
        }
    }
};

// Derived class: GuestUser (Hierarchical Inheritance from Person)
class GuestUser : public Person {
public:
    GuestUser(string name, string email) : Person(name, email) {}

    void displayPrivileges() override {
        cout << "Privileges: Can browse without registration.\n";
    }
};

// Class to manage Users
class UserManager {
private:
    vector<User> users;
    Admin admin;  
    
public:
    static int totalUsers;
    UserManager()
        : admin("admin", "admin123", "Admin", "admin@admin.com") {
        users.push_back(admin);
        cout << "Admin account created: Username - " << admin.getUsername() << endl;
    }

    void registerUser() {
        string username, password, name, email;
        char emailChoice;

        cout << "Enter username: ";
        cin >> username;
        cout << "Enter password: ";
        cin >> password;
        cin.ignore();  // Ignore newline before getline for name input
        cout << "Enter name: ";
        getline(cin, name);

        cout << "Do you want to enter an email? (y/n): ";
        cin >> emailChoice;

        User newUser;  // Declare the user object

        if (emailChoice == 'y' || emailChoice == 'Y') {
            cout << "Enter email: ";
            cin >> email;
            newUser = User(username, password, name, email); // Create new user with email
        } else {
            newUser = User(username, password, name);  // Use overloaded constructor
        }

        users.push_back(newUser);
        User::totalUsers += 1;
        newUser.displayPrivileges();
        cout << "Registration successful for user " << username << endl;
        userLogoutMenu();  
    }



    void userLogoutMenu() {                 
        int choice;
        cout << "1. Logout\n";
        while (true) {
            cout << "Enter 1 to Logout.";
            cin >> choice;
            if (cin.fail() || choice != 1) {
                cin.clear();
                cin.ignore(numeric_limits<streamsize>::max(), '\n');
                cout << "Invalid input. Please enter 1 to logout." << endl;
            } else {
                cout << "User logged out successfully.\n";
                break;
            }
        }
    }

    void login() {
        string username, password;
        cout << "Enter username: ";
        cin >> username;
        cout << "Enter password: ";
        cin >> password;

        for (const auto& user : users) {
            if (user.getUsername() == username && user.getPassword() == password) {
                if (username == "admin" && password == "admin123") {
                    adminMenu();
                } else {
                    cout << "Login successful! Welcome Back..." << user.getName() <<endl;
                    userLogoutMenu();
                }
                return;
            }
        }
        cout << "Login failed, incorrect username or password.\n";
    }

    void adminMenu() {
        int choice;
        cout << "Admin Login successful! Welcome, Admin."<<endl;
        admin.displayPrivileges();
        while (true) {
            cout << "1. View Users\n2. Logout\nEnter your choice: ";
            cin >> choice;

            if (choice == 1) {
                admin.viewUsers(users);
            } else if (choice == 2) {
                cout << "Admin logged out successfully."<<endl;
                break;
            } else {
                cout << "Invalid choice! Please enter 1 or 2.";
            }
        }
    }

    void guestLogin() {
        GuestUser guest("Guest", "guest@noemail.com");
        cout << "Welcome, Guest.\n";
        guest.displayPrivileges();
        guestLogoutMenu();
    }

    void guestLogoutMenu() {
        int choice;
        cout << "1. Logout\n";
        while (true) {
            cout << "Enter your choice: ";
            cin >> choice;
            if (cin.fail() || choice != 1) {
                cin.clear();
                cin.ignore(numeric_limits<streamsize>::max(), '\n');
                cout << "Invalid input. Please enter 1 to logout." << endl;
            } else {
                cout << "Guest logged out successfully.\n";
                break;
            }
        }
    }
};


// ............"Single Responsibility Principle(SRP)..........."
class Menu {
public:
    void displayMenu() {
        cout <<"1. Signup \n2. Login \n3. Guest \n";
    }

    int getUserChoice() {
        int choice;
        while (true) {
            cout << "Enter your choice: ";
            cin >> choice;

            if (cin.fail() || choice < 1 || choice > 3) {
                cin.clear();
                cin.ignore(numeric_limits<streamsize>::max(), '\n');
                cout << "Invalid input. Please enter a number between 1 and 3." << endl;
            } else {

                
                return choice;
            }
        }
    }
};

int main() {
    UserManager* userManager = new UserManager();
    Menu* menu = new Menu();
    int choice;

    while (true) {
        menu->displayMenu();
        choice = menu->getUserChoice();

        switch (choice) {
            case 1:
                userManager->registerUser();
                break;
            case 2:
                userManager->login();
                break;
            case 3:
                userManager->guestLogin();
                break;
        }
    }

    delete userManager;
    delete menu;

    return 0;
}
