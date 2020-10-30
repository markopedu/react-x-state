import React from "react";


const types = {
    start: "START",
    loaded: "LOADED"
};

const reducer = (state, action) => {
    switch (action.type) {
        case types.start:
            return { ...state, loading: true };
        case types.loaded:
            return {
                ...state,
                loading: false,
                data: [...state.data, ...action.newData],
                more: action.newData.length === 1,
                after: state.after + 1
            };
        default:
            throw new Error("Don't understand action");
    }
};

const MyContext = React.createContext();

export function MyProvider({ children }) {
    const [state, dispatch] = React.useReducer(reducer, {
        loading: false,
        more: true,
        data: [],
        after: 1
    });
    const { loading, data, after, more } = state;

    const load = () => {
        dispatch({ type: types.start });

        setTimeout(() => {
            const url = 'https://jsonplaceholder.typicode.com/posts/' + after;
            fetch(url)
            .then(r => r)
            .then(r => r.json())
            .then(data => {
                const newData = [ data ];
                dispatch({ type: types.loaded, newData });
            });


        }, 500);
    };

    return (
        <MyContext.Provider value={{ loading, data, more, load }}>
            {children}
        </MyContext.Provider>
    );
}

export default function App() {
    const { data, loading, more, load } = React.useContext(MyContext);
    const loader = React.useRef(load);
    const observer = React.useRef(
        new IntersectionObserver(
            entries => {
                const first = entries[0];
                if (first.isIntersecting) {
                    loader.current();
                }
            },
            { threshold: 1 }
        )
    );
    const [element, setElement] = React.useState(null);

    React.useEffect(() => {
        loader.current = load;
    }, [load]);

    React.useEffect(() => {
        const currentElement = element;
        const currentObserver = observer.current;

        if (currentElement) {
            currentObserver.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                currentObserver.unobserve(currentElement);
            }
        };
    }, [element]);

    const boxStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'pink',
        border: '4px solid purple',
        marginBottom: '5px',
        height: '50vh', width: '100%' };

    return (
        <div className="App">
            <div style={{ width: '100%', background: '#fff' }} >
                {data.map(post => (
                    <div key={post.id} style={boxStyle}>
                        <h3 style={{fontSize: '28px'}}>{post.title}</h3>
                        <p style={{ width: '480px'}}>{post.body}</p>
                    </div>
                ))}

                {loading && <div style={{...boxStyle, ...{ background: 'green' }}}>
                                <h3>Loading...</h3>
                            </div>}

                {!loading && more && (
                    <div ref={setElement} style={{ background: "transparent" }}></div>
                )}
            </div>
        </div>
    );
}
