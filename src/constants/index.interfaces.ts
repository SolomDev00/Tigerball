import {
  CourtPosition,
  EndAction,
  PlayerRole,
  TeamType,
  TouchAction,
} from "./index.types";

export interface TeamTemplate {
  id: string;
  name: string;
  players: string[];
}

export interface Player {
  id: string;
  name: string;
  favoriteNumber: number | null;
  roles?: string[] | null;
  isTemporary?: boolean;
}

export interface CourtPlayer {
  position: CourtPosition;
  player: Player | null;
  yellowCards?: number;
  redCards?: number;
}

export interface ActionRecord {
  id: string;
  set: string;
  point: number;
  score: string;
  team: TeamType;
  playerNo: string;
  playerName: string;
  playerId?: string;
  action: TouchAction;
  endPointAction?: EndAction;
  card?: "Yellow" | "Red";
}

export interface MatchState {
  homeScore: number;
  awayScore: number;
  currentSet: string;
  pointCounter: number;

  homeTeamCourt: CourtPlayer[];
  awayTeamCourt: CourtPlayer[];

  availablePlayers: Player[];
  teams: TeamTemplate[];

  actions: ActionRecord[];

  pointInProgress: boolean;
  currentActionTeam: TeamType | null;
  touchCount: number;

  // Actions
  addPlayerToRoster: (player: Player) => void;
  removePlayerFromRoster: (id: string) => void;

  addTeam: (team: TeamTemplate) => void;
  updateTeam: (id: string, team: Partial<TeamTemplate>) => void;
  deleteTeam: (id: string) => void;

  assignPlayerToCourt: (
    team: TeamType,
    position: CourtPosition,
    playerId: string,
  ) => void;
  removePlayerFromCourt: (team: TeamType, position: CourtPosition) => void;

  setAvailablePlayers: (players: Player[]) => void;
  startPoint: () => void;
  recordTouch: (team: TeamType, position: CourtPosition) => void;
  endPoint: (winningTeam: TeamType, endAction: EndAction) => void;
  changeSet: (set: string) => void;
  issueCard: (
    team: TeamType,
    position: CourtPosition,
    card: "Yellow" | "Red",
  ) => void;
}
