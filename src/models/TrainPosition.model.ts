interface TrainPosition {
    trainnumber: string;
    position: [number, number];
    timestamp: Date;
    bearing: number;
    status: boolean;
    speed: number;
}

export default TrainPosition;
