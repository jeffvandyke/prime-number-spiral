/** Starts at (0,0), draws in a pattern like so:
 *
 * 16 15 14 13 12
 * 17  4  3  2 11
 * 18  5  0→ 1 10
 * 19  6  7  8→ 9
 * 20 21 22 23 24
 */
export function makeSpiralIncrementor() {
    const rightDirection = { x: 1, y: 0 };
    const upDirection = { x: 0, y: 1 };
    const leftDirection = { x: -1, y: 0 };
    const downDirection = { x: 0, y: -1 };
    let x = 0;
    let y = 0;

    // Turn variables
    /** 0: → x1, 1: ↑ x1, 2: ← x2, 3: ↓ x2, 4: → x3, etc... */
    let currentTurn = 0;
    let stepsUntilNextTurn = 1;
    let turnDirection = rightDirection;

    function turnNext() {
        currentTurn += 1;
        const currentTurnMod4 = currentTurn % 4;
        turnDirection =
            currentTurnMod4 === 0
                ? rightDirection
                : currentTurnMod4 === 1
                ? upDirection
                : currentTurnMod4 === 2
                ? leftDirection
                : downDirection;
        stepsUntilNextTurn = 1 + Math.floor(currentTurn / 2);
    }

    return {
        stepNext(drawCallback: (x: number, y: number) => void) {
            drawCallback(x, y);
            // Position next point
            x = x + turnDirection.x;
            y = y + turnDirection.y;
            stepsUntilNextTurn -= 1;

            if (stepsUntilNextTurn === 0) {
                turnNext();
            }
        },
    };
}
