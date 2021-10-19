import { FC, useEffect, useState } from 'react';
import { useParams } from '../hooks/useParams';
import { frameEventFromMessage, messageFromFrameEvent } from '../utils/FrameEventUtils';
import HighlighterLayout from '../components/templates/HighlighterLayout';

const DebugHighlighter: FC = () => {
    const { code, index } = useParams();
    const [flashing, setFlashing] = useState<boolean>(false);

    useEffect(() => {
        window.addEventListener('message', function (e) {
            const frameEvent = frameEventFromMessage(e.data);
            if (frameEvent !== null && frameEvent.event === 'flash') {
                setFlashing(true);
                const timer = setTimeout(() => {
                    setFlashing(false);
                    parent.postMessage(
                        messageFromFrameEvent('flashed', {
                            code,
                            index: parseInt(index ?? ''),
                            hide: frameEvent.payload.fromHidden,
                        }),
                        '*',
                    );
                }, 500);
                return () => clearTimeout(timer);
            }
        });
    }, []);

    return <HighlighterLayout code={code} index={index} flashing={flashing} />;
};

export default DebugHighlighter;
