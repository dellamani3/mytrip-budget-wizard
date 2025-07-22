const database = require('../config/database');

class Trip {
  constructor(tripData) {
    this.id = tripData.id;
    this.userId = tripData.userId;
    this.destination = tripData.destination;
    this.budget = tripData.budget;
    this.travelers = tripData.travelers;
    this.duration = tripData.duration;
    this.travelStyle = tripData.travelStyle;
    this.specialRequirements = tripData.specialRequirements;
    this.tripData = tripData.tripData;
    this.status = tripData.status || 'active';
    this.createdAt = tripData.createdAt;
    this.updatedAt = tripData.updatedAt;
  }

  // Create a new trip
  static async create(tripData) {
    const { 
      userId, 
      destination, 
      budget, 
      travelers, 
      duration, 
      travelStyle, 
      specialRequirements,
      tripData: generatedTripData 
    } = tripData;
    
    const db = database.getDb();
    
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO trips (
          userId, destination, budget, travelers, duration, 
          travelStyle, specialRequirements, tripData, status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      db.run(query, [
        userId, 
        destination, 
        budget, 
        travelers, 
        duration, 
        travelStyle, 
        specialRequirements,
        JSON.stringify(generatedTripData),
        'active'
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(new Trip({
            id: this.lastID,
            userId,
            destination,
            budget,
            travelers,
            duration,
            travelStyle,
            specialRequirements,
            tripData: generatedTripData,
            status: 'active'
          }));
        }
      });
    });
  }

  // Find trips by user ID
  static async findByUserId(userId, limit = 10) {
    const db = database.getDb();
    
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM trips 
        WHERE userId = ? 
        ORDER BY createdAt DESC 
        LIMIT ?
      `;
      
      db.all(query, [userId, limit], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const trips = rows.map(row => {
            const trip = new Trip(row);
            // Parse tripData from JSON string
            if (trip.tripData && typeof trip.tripData === 'string') {
              try {
                trip.tripData = JSON.parse(trip.tripData);
              } catch (e) {
                trip.tripData = null;
              }
            }
            return trip;
          });
          resolve(trips);
        }
      });
    });
  }

  // Find trip by ID and user ID (for security)
  static async findByIdAndUserId(tripId, userId) {
    const db = database.getDb();
    
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM trips WHERE id = ? AND userId = ?';
      
      db.get(query, [tripId, userId], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          const trip = new Trip(row);
          // Parse tripData from JSON string
          if (trip.tripData && typeof trip.tripData === 'string') {
            try {
              trip.tripData = JSON.parse(trip.tripData);
            } catch (e) {
              trip.tripData = null;
            }
          }
          resolve(trip);
        } else {
          resolve(null);
        }
      });
    });
  }

  // Update trip
  async update(updateData) {
    const db = database.getDb();
    const { destination, budget, travelers, duration, travelStyle, specialRequirements, tripData } = updateData;
    
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE trips 
        SET destination = ?, budget = ?, travelers = ?, duration = ?, 
            travelStyle = ?, specialRequirements = ?, tripData = ?, 
            updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      db.run(query, [
        destination, 
        budget, 
        travelers, 
        duration, 
        travelStyle, 
        specialRequirements,
        JSON.stringify(tripData),
        this.id
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  // Delete trip (soft delete by changing status)
  async delete() {
    const db = database.getDb();
    
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE trips 
        SET status = 'deleted', updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      db.run(query, [this.id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  // Get trip statistics for user
  static async getUserTripStats(userId) {
    const db = database.getDb();
    
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          COUNT(*) as totalTrips,
          AVG(budget) as averageBudget,
          SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as activeTrips,
          MAX(createdAt) as lastTripDate
        FROM trips 
        WHERE userId = ?
      `;
      
      db.get(query, [userId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row || {
            totalTrips: 0,
            averageBudget: 0,
            activeTrips: 0,
            lastTripDate: null
          });
        }
      });
    });
  }

  // Convert to JSON (excluding sensitive data)
  toJSON() {
    const { ...tripData } = this;
    
    // Parse tripData if it's a string
    if (tripData.tripData && typeof tripData.tripData === 'string') {
      try {
        tripData.tripData = JSON.parse(tripData.tripData);
      } catch (e) {
        tripData.tripData = null;
      }
    }
    
    return tripData;
  }
}

module.exports = Trip; 