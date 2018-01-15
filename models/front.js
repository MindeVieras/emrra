
const connection = require('../config/db');

// Gets albums
exports.getList = function(req, res){

  connection.query(`SELECT
                      a.id, a.name,
                      GROUP_CONCAT(DISTINCT
                                    CASE WHEN m.status = 1
                                      THEN CONCAT(m.s3_key, ',', m.mime)
                                      ELSE NULL
                                    END ORDER BY m.id ASC SEPARATOR '|') AS media
                    FROM albums AS a
                      LEFT JOIN media AS m ON m.entity_id = a.id
                    GROUP BY a.id DESC
                    LIMIT 40`, function(err, albums) {
      if(err) {
        res.json({ack:'err', msg: err.sqlMessage});
      } else {
        let albums_data = [];

        albums.map(function(album){

          // Media
          let media = [];
          if (album.media) {
            // Split media rows
            album.media.split('|').map(function(m){
              // Split values
              const values = m.split(',').map(function(field){
                return field;
              });
              // Make object and push to media
              const mediaObj = new Object();
              mediaObj.key = require('../helpers/media').img(values[0], 'thumb');
              mediaObj.mime = values[1].includes('image') ? 'image' : 'video';
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
