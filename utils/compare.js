const _ = require("lodash");

const compare = (sqliteData, pgData) => {
  let updateFeederIds = [],
    insertFeederIds = [];
  sqliteData.forEach((value) => {
    let index = pgData.findIndex(
      (obj) => obj.feeder_master_id === value.feeder_master_id
    );
    if (index !== -1) {
      if (!_.isEqual(value, pgData[index])) {
        updateFeederIds.push(value.feeder_master_id);
      }
      pgData[index].discard = 1;
    } else {
      insertFeederIds.push(value.feeder_master_id);
    }
  });
  let deleteFeederIds = pgData
    .filter((pgObj) => !("discard" in pgObj))
    .map(({ feeder_master_id }) => feeder_master_id);
  return {
    update: updateFeederIds,
    insert: insertFeederIds,
    delete: deleteFeederIds,
  };
};

module.exports = compare;
