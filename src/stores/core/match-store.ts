import { create } from "zustand";
import {
  CourtPlayer,
  MatchState,
  ActionRecord,
} from "../../constants/index.interfaces";
import { TouchAction } from "@/constants/index.types";
import teamsData from "@/data/teams.json";

const initialCourt = (): CourtPlayer[] => [
  { position: 1, player: null },
  { position: 2, player: null },
  { position: 3, player: null },
  { position: 4, player: null },
  { position: 5, player: null },
  { position: 6, player: null },
];

export const useMatchStore = create<MatchState>((set) => ({
  homeScore: 0,
  awayScore: 0,
  currentSet: "Set1",
  pointCounter: 0,

  homeTeamCourt: initialCourt(),
  awayTeamCourt: initialCourt(),

  availablePlayers: [
    { id: "1", name: "أحمد سعيد", number: "10", role: "Striker 4" },
    { id: "2", name: "محمد علي", number: "7", role: "Passer" },
    { id: "3", name: "محمود حسن", number: "5", role: "Libero" },
    { id: "4", name: "خالد عمر", number: "9", role: "Striker 2" },
    { id: "5", name: "طارق فرنسيس", number: "11", role: "Striker 3" },
    { id: "6", name: "ياسر محمود", number: "1", role: "Striker 2" },
    { id: "7", name: "أسامة شريف", number: "8", role: "Passer" },
    { id: "8", name: "مصطفى فؤاد", number: "2", role: "Libero" },
    { id: "9", name: "علي سامي", number: "6", role: "Striker 4" },
    { id: "10", name: "نور الدين", number: "3", role: "Striker 2" },
    { id: "11", name: "حسن يوسف", number: "4", role: "Passer" },
    { id: "12", name: "علاء سعد", number: "12", role: "Striker 3" },
  ],

  teams: teamsData,
  actions: [],

  pointInProgress: false,
  currentActionTeam: null,
  touchCount: 0,

  addPlayerToRoster: (player) =>
    set((state) => ({ availablePlayers: [...state.availablePlayers, player] })),

  removePlayerFromRoster: (id) =>
    set((state) => ({
      availablePlayers: state.availablePlayers.filter((p) => p.id !== id),
    })),

  addTeam: (team) => set((state) => ({ teams: [...state.teams, team] })),

  updateTeam: (id, updatedTeam) =>
    set((state) => ({
      teams: state.teams.map((t) =>
        t.id === id ? { ...t, ...updatedTeam } : t,
      ),
    })),

  deleteTeam: (id) =>
    set((state) => ({
      teams: state.teams.filter((t) => t.id !== id),
    })),

  assignPlayerToCourt: (team, position, playerId) =>
    set((state) => {
      const player =
        state.availablePlayers.find((p) => p.id === playerId) || null;
      const courtKey = team === "Home" ? "homeTeamCourt" : "awayTeamCourt";
      return {
        [courtKey]: state[courtKey].map((cp) =>
          cp.position === position ? { ...cp, player } : cp,
        ),
      };
    }),

  removePlayerFromCourt: (team, position) =>
    set((state) => {
      const courtKey = team === "Home" ? "homeTeamCourt" : "awayTeamCourt";
      return {
        [courtKey]: state[courtKey].map((cp) =>
          cp.position === position ? { ...cp, player: null } : cp,
        ),
      };
    }),

  startPoint: () =>
    set((state) => {
      if (state.pointInProgress) return state;
      return {
        pointInProgress: true,
        currentActionTeam: null,
        touchCount: 0,
        pointCounter: state.pointCounter + 1,
      };
    }),

  recordTouch: (team, position) =>
    set((state) => {
      if (!state.pointInProgress) return state;

      let newTouchCount = state.touchCount + 1;

      // Reset touches if switching teams
      if (state.currentActionTeam !== team) {
        newTouchCount = 1;
      }

      const actionType: TouchAction =
        newTouchCount === 1
          ? "Defence"
          : newTouchCount === 2
            ? "Setting"
            : newTouchCount === 3
              ? "Striking"
              : "Error";

      const courtKey = team === "Home" ? "homeTeamCourt" : "awayTeamCourt";
      const courtPlayer = state[courtKey].find(
        (cp) => cp.position === position,
      );

      if (!courtPlayer || !courtPlayer.player) return state; // Ignore if no player is assigned

      const newAction: ActionRecord = {
        id: Math.random().toString(36).substring(7),
        set: state.currentSet,
        point: state.pointCounter,
        score: `${state.homeScore}-${state.awayScore}`,
        team,
        playerNo: courtPlayer.player.number,
        playerName: courtPlayer.player.name,
        action: actionType,
      };

      const updatedState = {
        currentActionTeam: team,
        touchCount: newTouchCount,
        actions: [...state.actions, newAction],
      };

      // If 4th touch, automatically end the point with an Error (Fault) for the current team
      if (newTouchCount === 4) {
        const opposingTeam = team === "Home" ? "Away" : "Home";
        newAction.endPointAction = "Fault";
        return {
          ...updatedState,
          homeScore:
            opposingTeam === "Home" ? state.homeScore + 1 : state.homeScore,
          awayScore:
            opposingTeam === "Away" ? state.awayScore + 1 : state.awayScore,
          pointInProgress: false,
          currentActionTeam: null,
        };
      }

      return updatedState;
    }),

  endPoint: (winningTeam, endAction) =>
    set((state) => {
      if (!state.pointInProgress) return state;

      const homeWon = winningTeam === "Home";

      // Update the last action with the endPoint result
      const updatedActions = [...state.actions];
      if (updatedActions.length > 0) {
        updatedActions[updatedActions.length - 1] = {
          ...updatedActions[updatedActions.length - 1],
          endPointAction: endAction,
        };
      }

      return {
        homeScore: homeWon ? state.homeScore + 1 : state.homeScore,
        awayScore: !homeWon ? state.awayScore + 1 : state.awayScore,
        pointInProgress: false,
        actions: updatedActions,
      };
    }),

  changeSet: (newSet) =>
    set({
      currentSet: newSet,
      pointCounter: 0,
      homeScore: 0,
      awayScore: 0,
      pointInProgress: false,
      touchCount: 0,
      currentActionTeam: null,
    }),
}));
