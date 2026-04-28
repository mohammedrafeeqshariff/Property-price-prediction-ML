import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // Main container styling
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },

  // App heading styling
  heading: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 30,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  // Input field styling
  input: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#495057',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    fontFamily: 'System',
  },

  // Add/Update button styling
  addButton: {
    width: '100%',
    backgroundColor: '#3498db',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 25,
    shadowColor: '#3498db',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    alignItems: 'center',
  },

  // Add button text styling
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // Individual task container
  task: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },

  // Task text styling
  itemList: {
    fontSize: 16,
    color: '#2c3e50',
    flex: 1,
    fontWeight: '500',
    lineHeight: 22,
  },

  // Task buttons container
  taskButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    marginRight: 12, 
  },  

  // Edit button styling
  editButton: {
    color: '#27ae60',
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#d5f4e6',
    borderRadius: 8,
    overflow: 'hidden',
    textAlign: 'center',
    minWidth: 50,
  },

  // Delete button styling
  deleteButton: {
    color: '#e74c3c',
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fadbd8',
    borderRadius: 8,
    overflow: 'hidden',
    textAlign: 'center',
    minWidth: 50,
  },
});

export default styles;