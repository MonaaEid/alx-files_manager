import redisClient from '../utils/redis';
import dbClient from '../utils/db';

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
				const token = req.header('X-Token');
				if (!token) {
				return res.status(401).send({ error: 'Unauthorized' });
				}
		
				const userId = await redisClient.getUserIdFromToken(token);
				if (!userId) {
				return res.status(401).send({ error: 'Unauthorized' });
				}
		
				const user = await dbClient.usersCollection.findOne({ _id: ObjectId(userId) });
		
				if (!user) {
				return res.status(401).send({ error: 'Unauthorized' });
				}
		
				return res.status(200).send({ id: user._id, email: user.email });
		}
}

export default UsersController;
