import {
  CourtPosition,
  EndAction,
  PlayerRole,
  TeamType,
  TouchAction,
} from "./index.types";

export interface Player {
  id: string;
  name: string;
  number: string;
  role: PlayerRole;
  isTemporary?: boolean;
}

export interface CourtPlayer {
  position: CourtPosition;
  player: Player | null;
}

export interface ActionRecord {
  id: string;
  set: string;
  point: number;
  score: string;
  team: TeamType;
  playerNo: string;
  playerName: string;
  action: TouchAction;
  endPointAction?: EndAction;
}

export interface MatchState {
  homeScore: number;
  awayScore: number;
  currentSet: string;
  pointCounter: number;

  homeTeamCourt: CourtPlayer[];
  awayTeamCourt: CourtPlayer[];

  availablePlayers: Player[];

  actions: ActionRecord[];

  pointInProgress: boolean;
  currentActionTeam: TeamType | null;
  touchCount: number;

  // Actions
  addPlayerToRoster: (player: Player) => void;
  removePlayerFromRoster: (id: string) => void;
  assignPlayerToCourt: (
    team: TeamType,
    position: CourtPosition,
    playerId: string,
  ) => void;
  removePlayerFromCourt: (team: TeamType, position: CourtPosition) => void;

  startPoint: () => void;
  recordTouch: (team: TeamType, position: CourtPosition) => void;
  endPoint: (winningTeam: TeamType, endAction: EndAction) => void;
  changeSet: (set: string) => void;
}
