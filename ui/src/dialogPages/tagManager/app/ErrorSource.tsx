import { FC } from 'react';
import { DialogPageProps } from '../../../types/DialogTypes';
import InfoDialogTitle from '../../../components/molecules/InfoDialogTitle';
import { Box, DialogContent } from '@material-ui/core';
import LazyShiki from '../../../components/atoms/LibraryLoaders/LazyShiki';

const ErrorSource: FC<DialogPageProps> = (props: DialogPageProps) => {
    const src = `
function serverRequest(query, callback){
  setTimeout(function(){
    var response = query + "full!";
    callback(response);
  },5000);
}

function getResults(results){
  console.log("Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong Response from the server: " + results);
}

serverRequest("The glass is half ", getResults);

// Result in console after 5 second delay:
// Response from the server: The glass is half full!
`.trim();

    return (
        <>
            <InfoDialogTitle fullscreen handleDialogClose={props.handleDialogClose}>
                Error source
            </InfoDialogTitle>
            <DialogContent
                style={{
                    margin: 0,
                    padding: 0,
                }}
                dividers
            >
                <Box pt={2} px={2}>
                    <b>File: {props.id}</b>
                    <LazyShiki language="js" code={src} errorPosition={{ row: 9, col: 9 }} />
                </Box>
            </DialogContent>
        </>
    );
};

export { ErrorSource };
