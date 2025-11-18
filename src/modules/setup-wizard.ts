export class SetupWizard {
    async start(): Promise<{ mode: string }> {
        console.log('\n🚀 DT ARBITR 3.2\n');
        console.log('1. TEST - виртуальная торговля');
        console.log('2. BATTLE - реальные сделки');
        console.log('q - Выход\n');
        
        return new Promise((resolve) => {
            const stdin = process.stdin;
            stdin.setRawMode(true);
            stdin.resume();
            stdin.setEncoding('utf8');

            const onData = (key: string) => {
                if (key === 'q' || key === '\u0003') { // Ctrl+C
                    console.log('\n🛑 Выход...');
                    process.exit(0);
                }
                
                if (key === '1') {
                    console.log('✅ Режим: TEST');
                    stdin.removeListener('data', onData);
                    stdin.setRawMode(false);
                    resolve({ mode: 'test' });
                } 
                else if (key === '2') {
                    console.log('✅ Режим: BATTLE');  
                    stdin.removeListener('data', onData);
                    stdin.setRawMode(false);
                    resolve({ mode: 'battle' });
                }
            };

            stdin.on('data', onData);
        });
    }
}
