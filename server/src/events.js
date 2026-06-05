export const EVENTS = {
  // Client → Server
  CREATE_ROOM: 'create_room',
  JOIN_ROOM: 'join_room',
  START_GAME: 'start_game',
  SUBMIT_ANSWER: 'submit_answer',
  PLAY_AGAIN: 'play_again',

  // Server → Client
  ROOM_CREATED: 'room_created',
  ROOM_JOINED: 'room_joined',
  ROOM_ERROR: 'room_error',
  PLAYER_JOINED: 'player_joined',
  PLAYER_LEFT: 'player_left',
  GAME_STARTED: 'game_started',
  QUESTION: 'question',
  ANSWER_RESULT: 'answer_result',
  ROUND_END: 'round_end',
  GAME_OVER: 'game_over',
  PLAYERS_UPDATE: 'players_update',
};
