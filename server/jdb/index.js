/**
 * jsondatabse
 * @name JSONDatabase
 * @author father of a lot - Elijah Bantugan
 * @version 1.0.0
 * @license MIT
 * @description An easy to use database that uses JSON data, which makes it easy to edit the data without code, easy to read the data (especially without 3rd party programs), and is overall easier to use and understand than other database implementations.
 */

'use strict';

const fs = require("fs");
const path = require("path");

module.exports = {
    /**
     * Create a new database object from a JSON file.
     * @param {String} path
     * A path to the database. If a URL is provided, it must use the `file:` protocol.
     * If a file descriptor is provided, the underlying file will _not_ be closed automatically.
     */
    database: function (location) {

        let jsonData;

        if (!fs.existsSync(location) && location != "memory") throw "ENONET: File does not exist"

        try {
            jsonData = location == "memory" ? {} : JSON.parse(fs.readFileSync(location, "utf8"));
        } catch (err) {
            throw 'Invalid JSON, failed to parse.'
        }

        return {

            /**
             * 
             * @param {String} table The name of the table to access. 
             * @returns All of the objects contained in that table.
             */

            all: (table) => jsonData[table],

            /**
             * Returns `undefined`.
             * @param {String} table The name of the table to access in the database object. 
             * @param {String} property The property to read to determine which is the correct row.
             * @param {any} value The value that the property must have to be found.
             * @param {Function} callback The callback that will be executed returning the selected row.
             */

            getRow: (table, property, value, callback) => {
                const t = jsonData[table];
                for (let i = 0; i < t.length; i++) {
                    if (!t[i]) continue
                    if (t[i][property] == value) callback(t[i])
                }
            },

            /**
             * 
             * @param {String} table The name of the table to access in the database object. 
             * @param {String} property The property to read to determine which is the correct row.
             * @param {any} value The value that the property must have to be found.
             */

            getRowSync: (table, property, value) => {
                const t = jsonData[table];
                for (let i = 0; i < t.length; i++) {
                    if (!t[i]) continue
                    if (t[i][property] == value) return t[i]
                }
            },

            /**
             * 
             * @param {String} table The name of the table to add a row to.
             * @param {Object} data The `JSON` object to add to the table. 
             * @param {Function} callback The callback that will be executed upon successful row addition.
             * @param {Boolean} dont_finalize Whether to finalize (write) to the file, or store in memory.
             */

            addRow: (table, data, cb, dontFinalize) => {
                jsonData[table].push(data);

                if (dontFinalize) void undefined
                else fs.writeFile(location, JSON.stringify(jsonData, null, '\t'), (err) => {
                    if (err) throw err;
                    return cb();
                });
            },

            /**
             * 
             * @param {String} table The name of the new table to add to the database. 
             * @param {Function} callback The callback that will be executed upon successful table addition.
             * @param {Boolean} dont_finalize Whether to finalize (write) to the file, or store in memory.
             */

            addTable: (table, cb, dontFinalize) => {
                jsonData[table] = [];

                if (dontFinalize) void cb()
                else fs.writeFile(location, JSON.stringify(jsonData, null, '\t'), (err) => {
                    if (err) throw err;
                    return cb();
                });
            },

            /**
             * Returns `undefined`.
             * @param {String} table The name of the table to add a row to.
             * @param {Object} data The `JSON` object that will be added to the table.
             * @param {Boolean} dont_finalize Whether to finalize (write) to the file, or store in memory.
             */

            addRowSync: (table, data, dontFinalize) => {
                jsonData[table].push(data);

                if (dontFinalize) void undefined
                else void fs.writeFileSync(location, JSON.stringify(jsonData, null, '\t'));
            },

            /**
             * Returns `undefined`.
             * @param {String} table The name of the new table to add to the database.
             * @param {Boolean} dont_finalize Whether to finalize (write) to the file, or store in memory.
             */

            addTableSync: (table, dontFinalize) => {
                jsonData[table] = [];

                if (dontFinalize) void undefined
                void fs.writeFileSync(location, JSON.stringify(jsonData, null, '\t'));
            },

            /**
             * Finalize (write) all data stored in the database on memory to the file.
             * This is used for writing data stored in memory that isn't wrote to the file yet (ex using dontFinalize parameter).
             * @param {Function} callback The callback function that will be executed when the database is finalized (wrote) to file. 
             */

            finalize: (cb) => {
                fs.writeFile(location, JSON.stringify(jsonData, null, '\t'), (err) => {
                    if (err) throw err;
                    return cb();
                });
            },

            /**
             * Returns `undefined`.
             * 
             * Finalize (write) all data stored in the database on memory to the file.
             * This is used for writing data stored in memory that isn't wrote to the file yet (ex using dontFinalize parameter).
             */

            finalizeSync: () => { void fs.writeFileSync(location, JSON.stringify(jsonData, null, '\t')) },

            /**
             * Updates the data of a row in the database.
             * @param {String} table The name of the table.
             * @param {String} property The property to read to determine which is the correct row to update.
             * @param {any} value The value that the property must have to be found.
             * @param {Object} data The `JSON` data that the row will be updated to.
             * @param {Function} callback The callback that will be executed when the row is updated.
             * @param {Boolean} dont_finalize Whether to finalize (write) to the file, or store in memory.
             */

            updateRow: (table, param, value, nv, cb, dontFinalize) => {
                const t = jsonData[table];
                for (let i = 0; i < t.length; i++) {
                    if (t[i][param] == value) {
                        jsonData[table][i] = nv;

                        if (dontFinalize) void cb()
                        else {
                            fs.writeFile(location, JSON.stringify(jsonData, null, '\t'), (err) => {
                                if (err) throw err;
                                cb();
                            })
                        }
                    }
                }
            },

            /**
             * Updates the data of a row in the database.
             * 
             * Returns `undefined`.
             * @param {String} table The name of the table. 
             * @param {String} property The property to read to determine which is the correct row to update.
             * @param {any} value The value that the property must have to be found.
             * @param {Object} data The `JSON` data that the row will be updated to.
             * @param {Boolean} dont_finalize Whether to finalize (write) to the file, or store in memory.
             */

            updateRowSync: (table, property, value, data, dontFinalize) => {
                const t = jsonData[table];
                for (let i = 0; i < t.length; i++) {
                    if (t[i][property] == value) {
                        jsonData[table][i] = data;

                        if (dontFinalize) void undefined;
                        else void fs.writeFileSync(location, JSON.stringify(jsonData, null, '\t'));
                    }
                }
            },

            /**
             * Clears all rows in the table provided.
             * 
             * Returns `undefined`.
             * @param {String} table The name of the table to clear
             * @param {Boolean} dont_finalize Wether to finalize (write) to the file, or store in memory.
             */

            clearTable: (table, dontFinalize) => {
                if (jsonData[table]) {
                    jsonData[table] = [];
                    if (dontFinalize) void undefined
                    else void fs.writeFileSync(location, JSON.stringify(jsonData, null, '\t'))
                } else throw `Table ${table} does not exist`
            },

            /**
             * Deletes a row in the database.
             * 
             * Returns `undefined`.
             * @param {String} table The name of the table. 
             * @param {String} property The property to read to determine which is the correct row to delete.
             * @param {any} value The value that the property must have to be found.
             * @param {Boolean} dont_finalize Whether to finalize (write) to the file, or store in memory.
             */

            deleteRow: (table, property, value, dontFinalize) => {
                const t = jsonData[table];
                for (let i = 0; i < t.length; i++) {
                    if (!t[i]) continue
                    if (t[i][property] == value) {
                        jsonData[table].splice(i, 1);

                        if (dontFinalize) void undefined;
                        else void fs.writeFileSync(location, JSON.stringify(jsonData, null, '\t'));
                    }
                }
            }
        }
    }
}