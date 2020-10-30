import React, {useEffect, useRef, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import { useMachine } from '@xstate/react';
import { toggleMachine } from './toggleMachine';

function useOnScreen(ref, options) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setVisible(entry.isIntersecting);
        }, options);

        if(ref.current) {
            observer.observe(ref.current);
        }

        return () => {
              if(ref.current) {
                  observer.unobserve(ref.current);
              }
        };

    }, [ ref, options ]);

    return visible;
}

function App() {
    const [ current, send ] = useMachine(toggleMachine);
    const styles = current.value === 'active' ? { background: 'red' } : { background: 'yellow' };
    const ref = useRef();
    const visible = useOnScreen(ref,{ rootMargin: '-100px' });

    return (
        <div  className="App">
          <header style={{ display: 'block',  ...styles}} className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <hr style={{width:'100%'}} />
            <button style={{fontSize: '36px'}} onClick={() => send('TOGGLE')}>Toggle</button>
          </header>
          <div style={{ height: '90vh', background: 'pink', borderBottom: '4px solid black' }} >
              <h2>Scroll Down</h2>
          </div>
          <div ref={ref}
               style={{
                   height: '100vh',
                   background: visible ? '#8abf8a' : '#f5ebc1',
                   display: 'flex',
                   justifyContent: 'center',
                   alignItems: 'center',
                   transition: 'all 1s',
               }} >
              {visible &&
                <div style={{ padding: '3rem' }}>
                    <img alt="random pic" src="https://picsum.photos/200/300?random=1" />
                </div>
              }
              {!visible &&
                 <div>
                     <h2>Keep scrolling...</h2>
                 </div>
              }
          </div>
        </div>
      );
}

export default App;
