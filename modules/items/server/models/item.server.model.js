'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  path = require('path'),
  config = require(path.resolve('./config/config')),
  chalk = require('chalk');

/**
 * Item Schema
 */
var ItemSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  owner: {
    name: {
      type: String,
      required: 'owner name cannot be blank'
    },
    id: {
      type: String,
      required: 'owner id cannot be blank'
    }
  },
  model: {
    type: Schema.ObjectId,
    ref: 'Model'
  },
  serialNumber: {
    type: String,
    trim: true,
    required: 'serialNumber cannot be blank'
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  resolutions: {
    resolutionDate: {
      type: [Date]
    },
    observations: {
      type: [String]
    },
    cost: {
      type: [Number]
    },
    technician: {
      type: [Schema.ObjectId],
      ref: 'Technician'
    },
  },  
  status: {
    type: String,
    default: 'Ingresado',
    trim: true,    
    required: 'status cannot be blank'
  },
  observations: {
    type: String,
    default: '',
    trim: true
  },
  warantyExpirationDate: {    
    type: Date
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

ItemSchema.statics.seed = seed;

mongoose.model('Item', ItemSchema);

/**
* Seeds the User collection with document (Item)
* and provided options.
*/
function seed(doc, options) {
  var Item = mongoose.model('Item');

  return new Promise(function (resolve, reject) {

    skipDocument()
      .then(findAdminUser)
      .then(add)
      .then(function (response) {
        return resolve(response);
      })
      .catch(function (err) {
        return reject(err);
      });

    function findAdminUser(skip) {
      var User = mongoose.model('User');

      return new Promise(function (resolve, reject) {
        if (skip) {
          return resolve(true);
        }

        User
          .findOne({
            roles: { $in: ['admin'] }
          })
          .exec(function (err, admin) {
            if (err) {
              return reject(err);
            }

            doc.user = admin;

            return resolve();
          });
      });
    }

    function skipDocument() {
      return new Promise(function (resolve, reject) {
        Item
          .findOne({
            title: doc.title
          })
          .exec(function (err, existing) {
            if (err) {
              return reject(err);
            }

            if (!existing) {
              return resolve(false);
            }

            if (existing && !options.overwrite) {
              return resolve(true);
            }

            // Remove Item (overwrite)

            existing.remove(function (err) {
              if (err) {
                return reject(err);
              }

              return resolve(false);
            });
          });
      });
    }

    function add(skip) {
      return new Promise(function (resolve, reject) {
        if (skip) {
          return resolve({
            message: chalk.yellow('Database Seeding: Item\t' + doc.title + ' skipped')
          });
        }

        var item = new Item(doc);

        item.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Item\t' + item.title + ' added'
          });
        });
      });
    }
  });
}
