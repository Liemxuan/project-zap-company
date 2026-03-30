const run = async () => {
    try {
        const getRes = await fetch('http://localhost:3000/api/border_radius/publish?theme=metro');
        const json = await getRes.json();
        
        let state = json?.data?.state || { components: {} };
        if (!state.components) state.components = {};
        if (!state.components['Toggle']) state.components['Toggle'] = {};
        
        state.components['Toggle'].bg = 'bg-error';
        
        console.log("Sending override: bg-error to Toggle component...");
        
        const postRes = await fetch('http://localhost:3000/api/border_radius/publish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ theme: 'metro', state })
        });
        
        const result = await postRes.json();
        if (result.success) {
            console.log("Push OK!");
        } else {
            console.error("Failed to publish:", result);
        }
    } catch (e) {
        console.error("Error:", e);
    }
};

run();
