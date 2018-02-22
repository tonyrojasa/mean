'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  path = require('path'),
  config = require(path.resolve('./config/config')),
  chalk = require('chalk');
var mongoose_delete = require('mongoose-delete');
/**
 * ModelType Schema
 */
var ModelTypeSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'name cannot be blank'
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

ModelTypeSchema.plugin(mongoose_delete, {
  deletedAt: true,
  deletedBy: true
});
ModelTypeSchema.plugin(mongoose_delete, { indexFields: 'all' });
// Override all methods 
ModelTypeSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

ModelTypeSchema.statics.seed = seed;

mongoose.model('ModelType', ModelTypeSchema);

/**
* Seeds the User collection with document (ModelType)
* and provided options.
*/
function seed(doc, options) {
  var ModelType = mongoose.model('ModelType');

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
        ModelType
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

            // Remove ModelType (overwrite)

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
            message: chalk.yellow('Database Seeding: ModelType\t' + doc.title + ' skipped')
          });
        }

        var modelType = new ModelType(doc);

        modelType.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: ModelType\t' + modelType.title + ' added'
          });
        });
      });
    }
  });
}
