import {useEffect, useState} from "react";
import { FetchData } from "../custom_hooks/getUsers";
const Intro = () => 
{
     const parseText = (text) => {
          const paragraphs = text.split('\n');

      const result = [];
      let currentHeader = null;

      for (const paragraph of paragraphs) {
        const tabs = paragraph.match(/^\t*/)[0].length;
        const content = paragraph.replace(/^\t*/, '').trim();

        if (tabs > 0) {
          if (currentHeader === null || tabs > currentHeader.level) {
            currentHeader = { level: tabs, content: [] };
            result.push(currentHeader);
          }
          currentHeader.content.push(content);
        } else {
          result.push({ content });
          currentHeader = null;
        }
      }

      return result.map((item, index) => {
        if (item.level) {
          // It's a header
          const HeaderComponent = `h${Math.min(item.level + 1, 5)}`;
          return React.createElement(
            HeaderComponent,
            { key: index },
            item.content.join(' ')
          );
        } else {
          // It's a paragraph
          return React.createElement('p', { key: index }, item.content);
        }
      });
     } 
    const [parsedResult,setParsedResult] = useState(null);
    //Fetch the data 
    useEffect(() => 
        {
            FetchData("/api/intro/","GET",
            localStorage.getItem("access_token"),{})
            then(data => 
                {
                   setParsedResult(parseText(data.text));
                });
        },[]);
    return (
        <>
            <h1>Bemutatkozó oldal</h1>
            {parsedResult}
                    
       </>
    )
};

export default Intro;
