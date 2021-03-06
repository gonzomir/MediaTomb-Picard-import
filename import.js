// Default MediaTomb import script.
// see MediaTomb scripting documentation for more information

/*MT_F*
    
    MediaTomb - http://www.mediatomb.cc/
    
    import.js - this file is part of MediaTomb.
    
    Copyright (C) 2006-2010 Gena Batyan <bgeradz@mediatomb.cc>,
                            Sergey 'Jin' Bostandzhyan <jin@mediatomb.cc>,
                            Leonhard Wimmer <leo@mediatomb.cc>
    
    This file is free software; the copyright owners give unlimited permission
    to copy and/or redistribute it; with or without modifications, as long as
    this notice is preserved.
    
    This file is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
    
    $Id: import.js 2081 2010-03-23 20:18:00Z lww $
*/

function addAudio(obj)
{
 
    var desc = '';
    var artist_full;
    var album_full;
    
    // first gather data
    var title = obj.meta[M_TITLE];
    if (!title) title = obj.title;
    
    var artist = obj.meta[M_ARTIST];
    if (!artist) 
    {
        artist = 'Unknown';
        artist_full = null;
    }
    else
    {
        artist_full = artist;
        desc = artist;
    }
    
    var albumartist = obj.aux['TPE2'] || obj.aux['ALBUMARTIST'] || obj.aux['Album Artist'] || obj.aux['aART'] || obj.aux['WM/AlbumArtist'];
    if (!albumartist)
    {
		albumartist = artist;
	}
	
	var artists = artist.split(/\sfeat[^\s]*\s|,\s*|\s&\s|\sand\s/i);
    
    var album = obj.meta[M_ALBUM];
    if (!album) 
    {
        album = 'Unknown';
        album_full = null;
    }
    else
    {
        desc = desc + ', ' + album;
        album_full = album;
    }
    
    if (desc)
        desc = desc + ', ';
    
    desc = desc + title;
    
    var date = obj.aux['TDOR'] || obj.aux['TORY'] || obj.aux['ORIGINALDATE'] || obj.meta[M_DATE];
    if (!date)
    {
        date = 'Unknown';
    }
    else
    {
        date = getYear(date);
        desc = desc + ', ' + date;
    }
    
	var genre = obj.meta[M_GENRE]; 
	var genres = new Array();
	if (!genre) { 
		genre = 'Unknown'; 
		genres[0] = 'Unknown'; 
	} 
	else { 
		genres = genre.split(/[,;\/]\s*/); 
		desc = desc + ', ' + genres[0]; 
	} //Only first genre in description 
	
    
    var description = obj.meta[M_DESCRIPTION];
    if (!description) 
    {
        obj.meta[M_DESCRIPTION] = desc;
    }
    
    var track = obj.meta[M_TRACKNUMBER];
    if (!track)
        track = '';
    else
    {
        if (track.length == 1)
        {
            track = '0' + track;
        }
        track = track + ' ';
    }
    
    var decade = obj.aux['COMM:Songs-DB_Custom1'] || obj.aux['COMMENT:Songs-DB_Custom1'] || obj.aux['Comment:Songs-DB_Custom1'];
    

    var temp = '';
    if (artist_full)
        temp = artist_full;
    
    if (album_full)
        temp = temp + ' - ' + date + ' - ' + album + ' - ';
    else
        temp = temp + ' - ';


    chain = new Array('Audio', 'All - full name');
    obj.title = temp + track + title;
    addCdsObject(obj, createContainerChain(chain));
    
    chain = new Array('Audio', 'Artists', albumartist, 'All - full name');
    addCdsObject(obj, createContainerChain(chain));
    
    if(artists.length > 1 && albumartist != artist)
    {
		for (i = 0; i < artists.length; i++)
		{
			var a = artists[i].trim();
			if(a != albumartist)
			{
				chain = new Array('Audio', 'Artists', a, 'All - full name');
				addCdsObject(obj, createContainerChain(chain));
			}
		}
	}

    chain = new Array('Audio', 'Artists', albumartist, date + ' - ' + album);
    obj.title = title;
    addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER_MUSIC_ALBUM);
    
    
    chain = new Array('Audio', 'Albums', date + ' - ' + album + ' - ' + albumartist);
    obj.title = title;
    addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER_MUSIC_ALBUM);
    
	// GENRE // 
	for (var i = 0; i < genres.length; i++) {

		chain = new Array('Audio', 'Genres', genres[i], 'Artists', albumartist);
		obj.title = title + ' - ' + date + ' - ' + album;
		addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER_MUSIC_ARTIST);
		chain = new Array('Audio', 'Genres', genres[i]);
		obj.title = title + ' - ' + artist;
		addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER_MUSIC_GENRE);

	}
    
    chain = new Array('Audio', 'Year', date);
	obj.title = temp + track + title;
    addCdsObject(obj, createContainerChain(chain));

	// DECADE //
	if(decade){
		chain = new Array('Audio', 'Decade', decade);
		obj.title = temp + track + title;
		addCdsObject(obj, createContainerChain(chain));
	}

}

function addVideo(obj)
{
    var chain = new Array('Video', 'All Video');
    addCdsObject(obj, createContainerChain(chain));

    var dir = getRootPath(object_root_path, obj.location);

    if (dir.length > 0)
    {
        chain = new Array('Video', 'Directories');
        chain = chain.concat(dir);

        addCdsObject(obj, createContainerChain(chain));
    }
}

function addWeborama(obj)
{
    var req_name = obj.aux[WEBORAMA_AUXDATA_REQUEST_NAME];
    if (req_name)
    {
        var chain = new Array('Online Services', 'Weborama', req_name);
        addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_PLAYLIST_CONTAINER);
    }
}

function addImage(obj)
{
    var chain = new Array('Photos', 'All Photos');
    addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER);

    var date = obj.meta[M_DATE];
    if (date)
    {
        var dateParts = date.split('-');
        if (dateParts.length > 1)
        {
            var year = dateParts[0];
            var month = dateParts[1];

            chain = new Array('Photos', 'Year', year, month);
            addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER);
        }

        chain = new Array('Photos', 'Date', date);
        addCdsObject(obj, createContainerChain(chain), UPNP_CLASS_CONTAINER);
    }

    var dir = getRootPath(object_root_path, obj.location);

    if (dir.length > 0)
    {
        chain = new Array('Photos', 'Directories');
        chain = chain.concat(dir);

        addCdsObject(obj, createContainerChain(chain));
    }
}


function addYouTube(obj)
{
    var chain;

    var temp = parseInt(obj.aux[YOUTUBE_AUXDATA_AVG_RATING], 10);
    if (temp != Number.NaN)
    {
        temp = Math.round(temp);
        if (temp > 3)
        {
            chain = new Array('Online Services', 'YouTube', 'Rating', 
                                  temp.toString());
            addCdsObject(obj, createContainerChain(chain));
        }
    }

    temp = obj.aux[YOUTUBE_AUXDATA_REQUEST];
    if (temp)
    {
        var subName = (obj.aux[YOUTUBE_AUXDATA_SUBREQUEST_NAME]);
        var feedName = (obj.aux[YOUTUBE_AUXDATA_FEED]);
        var region = (obj.aux[YOUTUBE_AUXDATA_REGION]);

            
        chain = new Array('Online Services', 'YouTube', temp);

        if (subName)
            chain.push(subName);

        if (feedName)
            chain.push(feedName);

        if (region)
            chain.push(region);

        addCdsObject(obj, createContainerChain(chain));
    }
}

function addTrailer(obj)
{
    var chain;

    chain = new Array('Online Services', 'Apple Trailers', 'All Trailers');
    addCdsObject(obj, createContainerChain(chain));

    var genre = obj.meta[M_GENRE];
    if (genre)
    {
        genres = genre.split(', ');
        for (var i = 0; i < genres.length; i++)
        {
            chain = new Array('Online Services', 'Apple Trailers', 'Genres',
                              genres[i]);
            addCdsObject(obj, createContainerChain(chain));
        }
    }

    var reldate = obj.meta[M_DATE];
    if ((reldate) && (reldate.length >= 7))
    {
        chain = new Array('Online Services', 'Apple Trailers', 'Release Date',
                          reldate.slice(0, 7));
        addCdsObject(obj, createContainerChain(chain));
    }

    var postdate = obj.aux[APPLE_TRAILERS_AUXDATA_POST_DATE];
    if ((postdate) && (postdate.length >= 7))
    {
        chain = new Array('Online Services', 'Apple Trailers', 'Post Date',
                          postdate.slice(0, 7));
        addCdsObject(obj, createContainerChain(chain));
    }
}

// main script part

if (getPlaylistType(orig.mimetype) == '')
{
    var arr = orig.mimetype.split('/');
    var mime = arr[0];
    
    // var obj = copyObject(orig);
    
    var obj = orig; 
    obj.refID = orig.id;
    
    if (mime == 'audio')
    {
        //if (obj.onlineservice == ONLINE_SERVICE_WEBORAMA)
        //    addWeborama(obj);
        //else
            addAudio(obj);
    }
    
    if (mime == 'video')
    {
        if (obj.onlineservice == ONLINE_SERVICE_YOUTUBE)
            addYouTube(obj);
        else if (obj.onlineservice == ONLINE_SERVICE_APPLE_TRAILERS)
            addTrailer(obj);
        else
            addVideo(obj);
    }
    
    if (mime == 'image')
    {
        addImage(obj);
    }

    if (orig.mimetype == 'application/ogg')
    {
        if (orig.theora == 1)
            addVideo(obj);
        else
            addAudio(obj);
    }
}

''.trim || (String.prototype.trim = // Use the native method if available, otherwise define a polyfill:
function () { // trim returns a new string (which replace supports)
	return this.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g,'') // trim the left and right sides of the string
});
