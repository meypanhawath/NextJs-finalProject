'use client';

import { useEffect } from 'react';
import { addToLocalRecent } from '../../lib/localStore';

type Props = {
  id: number;
  title?: string;
  poster_path?: string | null;
};

export default function TrackRecent({ id, title, poster_path }: Props) {
  useEffect(() => {
    try {
      addToLocalRecent({ id, title, poster_path });
    } catch (e) {
      // swallow - local storage failures shouldn't break UI
      console.error('TrackRecent failed', e);
    }
  }, [id, title, poster_path]);

  return null;
}
