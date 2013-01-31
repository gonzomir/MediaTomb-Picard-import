MediaTomb Picard import
=======================

This are the scripts I use to import my music collection, tagged with Musicbrainz Picard + LastFMPlus plugin, into MediaTomb library.

Features
--------

* Deal with multiple genres, separated by comma or semicolon.
* Use the first genre as magor and the next as sub-genres if desired.
* Use Original Release Date field for album year and add it to full names for sorting the albums in chronological order.

Issues
------

MediaTomb does not present all the available tags to the import fields, so I can't use decade of mood fields.

References
----------

* [MusicBrainz_Picard](http://musicbrainz.org/doc/MusicBrainz_Picard)
* [LastFMPlus](http://musicbrainz.org/doc/MusicBrainz_Picard/Documentation/Plugins/Lastfmplus)
* [MusicBrainz Picard Tags Mapping](http://wiki.musicbrainz.org/MusicBrainz_Picard/Tags/Mapping)

* [MediaTomb scripting docs](http://mediatomb.cc/pages/scripting)
* [Mediatomb import script examples](http://mediatomb.cc/dokuwiki/scripting:scripting)
* [MediaTomb config options for auxilary data extraction](http://mediatomb.cc/pages/documentation#id2858022)
* [A forum post that gave me the idea of writing my own import script](http://sourceforge.net/projects/mediatomb/forums/forum/440751/topic/4732119)

