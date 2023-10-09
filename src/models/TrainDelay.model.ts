import type TrainLocation from "./TrainLocation.model";

export default interface TrainDelay {
    ActivityId: string;
    ActivityType: string;
    AdvertisedTimeAtLocation: string;
    AdvertisedTrainIdent: string;
    Canceled: boolean;
    EstimatedTimeAtLocation: string;
    FromLocation: TrainLocation;
    LocationSignature: string;
    OperationalTrainNumber: string;
    ToLocation: TrainLocation;
    TrainOwner: string;
}
