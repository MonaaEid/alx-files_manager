import redisClient from '../utils/redis';
import dbClient from '../utils/db';
import sha1 from 'sha1';
import Queue from 'bull/lib/queue';

class UsersController {
	static async postNew(req, res) {
		const { email, password } = req.body;

		if (!email) {
			return res.status(400).send({ error: 'Missing email' });
		}

		if (!password) {
			return res.status(400).send({ error: 'Missing password' });
		}

		const userExists = await dbClient.usersCollection.findOne({ email });

		if (userExists) {
			return res.status(400).send({ error: 'Already exist' });
		}

		const user = await dbClient.usersCollection.insertOne({ email, password: sha1(password) });

		return res.status(201).send({ id: user.insertedId, email });
	}

	static async getMe(req, res) {
		const { user } = req;
    res.status(200).json({ email: user.email, id: user._id.toString() });
	}
}

export default UsersController;
