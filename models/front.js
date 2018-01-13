
const connection = require('../config/db');

// Gets albums
exports.getList = function(req, res){

  connection.query(`SELECT
                      a.id, a.name,
                      GROUP_CONCAT(DISTINCT m.s3_key) AS media
                    FROM albums AS a
                      LEFT JOIN media AS m ON m.entity_id = a.id
                    GROUP BY a.id DESC LIMIT 500`, function(err, albums) {
      if(err) {
        res.json({ack:'err', msg: err.sqlMessage});
      } else {
        let albums_data = [];

        albums.map(function(album){
          let media = [];
          if (album.media) {
            album.media.split(',').map(function(m){
              const mediaObj = new Object();
              mediaObj.key = require('../helpers/media').img(m, 'icon');
              media.push(mediaObj);
            });
          }

          albums_data.push(
            {
              id: album.id,
              name: album.name,
              media
            }
          );
        });
        res.json({ack:'ok', msg: 'Albums list', data: albums_data});
      }
    });
};
