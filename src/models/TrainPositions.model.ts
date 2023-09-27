import type TrainPosition from "./TrainPosition.model";

interface TrainPositions {
    [trainNumber: string]: TrainPosition;
}

export default TrainPositions;
