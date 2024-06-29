import { useState, useEffect } from 'react';
import { createSink } from 'stream-to-array';

const MyComponent = ({prompt,role}) => {
  const [streamData, setStreamData] = useState([]);
  const [fetchStatus, setFetchStatus] = useState({ status: 'idle' });

  useEffect(() => {
    if (prompt !== '') {
      fetch(`/api/v2/mistral?prompt=${prompt}&role=${role}`)
        .then(response => response.body)
        .pipe(createSink((err, chunks) => {
          if (err) {
            console.error(err);
            setFetchStatus({ status: 'error', error: err });
          } else {
            const streamData = [];
            chunks.forEach(chunk => {
              streamData.push(...chunk));
            setStreamData(streamData);
            setFetchStatus({ status: 'success' });
          }
        }));
    } else {
      setFetchStatus({ status: 'idle' });
      setStreamData([]);
    }
  }, [prompt]);

  

  return (
    <div>
      
      {fetchStatus.status === 'success' && (
        <ul>
          {streamData.map((chunk, index) => (
            <li key={index}>{chunk}</li>
          ))}
        </ul>
      )}
      {fetchStatus.status === 'error' && (
        <p>Error fetching data: {fetchStatus.error.message}</p>
      )}
    </div>
  );
};

export default MyComponent;
