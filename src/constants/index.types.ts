export type PlayerRole =
  | "Libero"
  | "Striker 2"
  | "Striker 4"
  | "Striker 3"
  | "Passer";

export type CourtPosition = 1 | 2 | 3 | 4 | 5 | 6;

export type TeamType = "Home" | "Away";

export type TouchAction = "Defence" | "Setting" | "Striking";

export type EndAction =
  | "Block"
  | "Out Side"
  | "Inside"
  | "Touch Net"
  | "Ace"
  | "Fault";
