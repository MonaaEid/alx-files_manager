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

		const user = await (await dbClient.usersCollection()).findOne({ email });

    if (user) {
      res.status(400).json({ error: 'Already exist' });
      return;
    }
    const insertionInfo = await (await dbClient.usersCollection())
      .insertOne({ email, password: sha1(password) });
    const userId = insertionInfo.insertedId.toString();

    userQueue.add({ userId });
    res.status(201).json({ email, id: userId });
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
