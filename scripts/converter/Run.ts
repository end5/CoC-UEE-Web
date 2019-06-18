import { writeFileSync, readFileSync, renameSync } from 'fs';
import { fixText } from './Converter';
import { walk } from './walk';

walk('classes', (file) => fix(file, true), (err) => console.error(err));
walk('includes', (file) => fix(file, true), (err) => console.error(err));

function fix(file: string, overwrite?: boolean) {
    if (file.endsWith('.as')) {
        console.log('Fixing ' + file);

        const data = readFileSync(file, 'utf-8');
        const newValue = fixText(data);
        const newFile = file.replace('.as', '.ts');
        if (overwrite)
            renameSync(file, newFile);
        writeFileSync(newFile, newValue, 'utf-8');
    }
}
