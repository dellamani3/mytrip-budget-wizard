const bcrypt = require('bcryptjs');
const database = require('../config/database');

class User {
  constructor(userData) {
    this.id = userData.id;
    this.username = userData.username;
    this.email = userData.email;
    this.password = userData.password;
    this.firstName = userData.firstName;
    this.lastName = userData.lastName;
    this.preferences = userData.preferences;
    this.createdAt = userData.createdAt;
    this.updatedAt = userData.updatedAt;
  }

  // Create a new user
  static async create(userData) {
    const { username, email, password, firstName, lastName } = userData;
    
    try {
      // Hash the password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      const db = database.getDb();
      
      return new Promise((resolve, reject) => {
        const query = `
          INSERT INTO users (username, email, password, firstName, lastName)
          VALUES (?, ?, ?, ?, ?)
        `;
        
        db.run(query, [username, email, hashedPassword, firstName, lastName], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(new User({
              id: this.lastID,
              username,
              email,
              firstName,
              lastName
            }));
          }
        });
      });
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    const db = database.getDb();
    
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE email = ?';
      
      db.get(query, [email], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          resolve(new User(row));
        } else {
          resolve(null);
        }
      });
    });
  }

  // Find user by username
  static async findByUsername(username) {
    const db = database.getDb();
    
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE username = ?';
      
      db.get(query, [username], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          resolve(new User(row));
        } else {
          resolve(null);
        }
      });
    });
  }

  // Find user by ID
  static async findById(id) {
    const db = database.getDb();
    
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE id = ?';
      
      db.get(query, [id], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          resolve(new User(row));
        } else {
          resolve(null);
        }
      });
    });
  }

  // Verify password
  async verifyPassword(password) {
    return bcrypt.compare(password, this.password);
  }

  // Update user profile
  async updateProfile(updateData) {
    const db = database.getDb();
    const { firstName, lastName, preferences } = updateData;
    
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE users 
        SET firstName = ?, lastName = ?, preferences = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      db.run(query, [firstName, lastName, preferences, this.id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  // Get user data without password
  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

module.exports = User; 