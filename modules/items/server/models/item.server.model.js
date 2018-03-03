'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  path = require('path'),
  config = require(path.resolve('./config/config')),
  chalk = require('chalk');
var autoIncrement = require('mongoose-sequence')(mongoose);
var mongoose_delete = require('mongoose-delete');

/**
 * Item Schema
 */
var ItemSchema = new Schema({
  itemNumber: {
    type: Number
  },
  created: {
    type: Date,
    default: Date.now
  },
  store: {
    type: Schema.ObjectId,
    ref: 'Store'
  },
  owner: {
    name: {
      type: String,
      trim: true,
      required: 'owner name cannot be blank'
    },
    id: {
      type: String,
      trim: true,
      required: 'owner id cannot be blank'
    },
    mobilePhone: {
      type: String,
      trim: true,
      required: 'mobliePhone id cannot be blank'
    },
    otherPhone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true
    }
  },
  model: {
    type: Schema.ObjectId,
    ref: 'Model'
  },
  serialNumber: {
    type: String,
    index: true,
    trim: true,
    required: 'serialNumber cannot be blank'
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  color: {
    type: String,
    ref: 'Color',
    required: 'color cannot be blank'
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  resolutions: [{
    creationDate: {
      type: Date
    },
    date: {
      type: Date
    },
    condition: {
      type: String
    },
    observations: {
      type: String
    },
    cost: {
      type: Number,
      default: 0
    },
    technician: {
      type: Schema.ObjectId,
      ref: 'Technician'
    }
  }],
  notifications: [{
    date: {
      type: Date
    },
    type: {
      type: String
    },
    observations: {
      type: String
    },
    status: {
      type: String
    },
    notifier: {
      type: Schema.ObjectId,
      ref: 'User'
    }
  }],
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
  waranty: {
    enabled: {
      type: Boolean,
      default: false
    },
    expirationDate: {
      type: Date
    }
  },
  revisionCost: {
    type: Number
  },
  workshop: {
    type: Schema.ObjectId,
    ref: 'Workshop'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

ItemSchema.plugin(autoIncrement, { inc_field: 'itemNumber' });

ItemSchema.plugin(mongoose_delete, {
  deletedAt: true,
  deletedBy: true
});
ItemSchema.plugin(mongoose_delete, { indexFields: 'all' });
// Override all methods 
ItemSchema.plugin(mongoose_delete, { overrideMethods: 'all' });


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
