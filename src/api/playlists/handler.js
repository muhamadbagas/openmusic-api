const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const { name = 'unnamed' } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const playlistId = await this._service.addPlaylist({
      name,
      owner: credentialId,
    });

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._service.getPlaylists(credentialId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistByIdHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.deletePlaylistById(playlistId);

    return {
      status: 'success',
      message: 'Playlist telah dihapus',
    };
  }

  async postSongToPlaylistHandler(request, h) {
    this._validator.validateManageSongInPlaylistPayload(request.payload);
    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const activityName = 'add';

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.checkSong(songId);
    await this._service.addPlaylistSong(playlistId, songId);
    await this._service.addPlaylistActivity(playlistId, songId, credentialId, activityName);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke dalam playlist',
    });
    response.code(201);
    return response;
  }

  async getPlaylistWithSongsByIdHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    const playlistSongs = await this._service.getPlaylistSongById(playlistId);

    return {
      status: 'success',
      data: {
        playlist: playlistSongs,
      },
    };
  }

  async deleteSongFromPlaylistHandler(request) {
    this._validator.validateManageSongInPlaylistPayload(request.payload);
    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const activityName = 'delete';

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.deletePlaylistSong(playlistId, songId);
    await this._service.addPlaylistActivity(playlistId, songId, credentialId, activityName);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }

  async getPlaylistActivityHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    const activityLog = await this._service.getPlaylistActivities(playlistId);

    return {
      status: 'success',
      data: activityLog,
    };
  }
}

module.exports = PlaylistsHandler;
