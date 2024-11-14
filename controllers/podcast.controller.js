import { getPodcast, getAllPodcasts } from '../models/podcast.js';

export const getPodcastByName = async (req, res) => {
  try {
    const podcast = await getPodcast(req.params.name);
    res.json(podcast);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllPodcasts = async (req, res) => {
  try {
    let podcasts = await getAllPodcasts();
    for (let i in podcasts) {
      let p = podcasts[i].audioFile;
      podcasts[i].audioFile = btoa(String.fromCharCode(...new Uint8Array(p)));
    }
    res.json(podcasts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};