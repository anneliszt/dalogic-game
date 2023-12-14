import BoardPosition from "./BoardPosition";
import Board from "./Board";
import Piece from "./Piece";

export default class Move {
  public capturePiece: Piece | null | undefined;
  private addedScore: number = 0;
  constructor(
    public srcPos: BoardPosition,
    public destPos: BoardPosition,
  ) {
    if (srcPos.piece === null) {
      throw new Error("Move srcPos must have a piece");
    }
  }

  get isJump() {
    return Math.abs(this.srcPos.tile.row - this.destPos.tile.row) > 1;
  }

  getCapturedPosition(board: Board) {
    const row = (this.srcPos.tile.row + this.destPos.tile.row) / 2;
    const column = (this.srcPos.tile.column + this.destPos.tile.column) / 2;
    return board.getBoardPosition([row, column])!;
  }

  execute(board: Board) {
    if (this.isJump) {
      const capturedPos = this.getCapturedPosition(board);
      this.capturePiece = capturedPos.piece;
      board.removePieceAtPosition(capturedPos);
      const movingPlayer = this.srcPos.piece!.player;

      this.addedScore = this.destPos.tile.performOperation(
        this.srcPos.piece!,
        this.capturePiece!,
      );

      // this.srcPos.piece!.pieceValue = this.addedScore;

      movingPlayer.addScore(this.addedScore);
      // console.log(
      //   `Player ${movingPlayer.id} score is now ${movingPlayer.score}`,
      // );
    }
    board.movePiecePosition(this.srcPos.piece!, this.destPos);
  }

  undo(board: Board) {
    board.movePiecePosition(this.destPos.piece!, this.srcPos);
    if (this.isJump) {
      if (this.capturePiece) {
        board.addPieceAtPosition(
          this.capturePiece,
          this.getCapturedPosition(board),
        );
      }

      if (this.srcPos.piece) {
        const movingPlayer = this.srcPos.piece.player;
        movingPlayer.addScore(-this.addedScore);
        // console.log(
        //   `Player ${movingPlayer.id} score is now ${movingPlayer.score}`,
        // );
      }
    }
  }
}
