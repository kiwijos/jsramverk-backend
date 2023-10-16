import bcrypt from "bcryptjs";
import User from "../../db/models/User";

const userRepository = {
    createUser: async ({
        username,
        password,
        email
    }: {
        username: string;
        password: string;
        email: string;
    }) => {
        const passwordHash = bcrypt.hashSync(password, 10);
        const newUser = new User({ username, passwordHash, email });
        await newUser.save();

        return newUser;
    },

    getUserByUsername: async (username: string) => {
        return await User.findOne({ username: username });
    },

    getUserByEmail: async (email: string) => {
        return await User.findOne({ email: email });
    },

    getUserByUsernameOrEmail: async (username: string, email: string) => {
        return await User.findOne({
            $or: [{ username: username }, { email: email }]
        });
    }
};

export default userRepository;
