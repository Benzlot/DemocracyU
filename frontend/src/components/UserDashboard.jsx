import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using react-router-dom

const UserDashboard = () => {
  return (
    <div>
      <div>
        <img
          loading="lazy"
          srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/163ec1926cd918c13a5fb6055a8069d3e3debbefcf978652c071fdb5564ad73e?apiKey=1f6df3b559f94f9cadab107301ebb8cc&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/163ec1926cd918c13a5fb6055a8069d3e3debbefcf978652c071fdb5564ad73e?apiKey=1f6df3b559f94f9cadab107301ebb8cc&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/163ec1926cd918c13a5fb6055a8069d3e3debbefcf978652c071fdb5564ad73e?apiKey=1f6df3b559f94f9cadab107301ebb8cc&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/163ec1926cd918c13a5fb6055a8069d3e3debbefcf978652c071fdb5564ad73e?apiKey=1f6df3b559f94f9cadab107301ebb8cc&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/163ec1926cd918c13a5fb6055a8069d3e3debbefcf978652c071fdb5564ad73e?apiKey=1f6df3b559f94f9cadab107301ebb8cc&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/163ec1926cd918c13a5fb6055a8069d3e3debbefcf978652c071fdb5564ad73e?apiKey=1f6df3b559f94f9cadab107301ebb8cc&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/163ec1926cd918c13a5fb6055a8069d3e3debbefcf978652c071fdb5564ad73e?apiKey=1f6df3b559f94f9cadab107301ebb8cc&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/163ec1926cd918c13a5fb6055a8069d3e3debbefcf978652c071fdb5564ad73e?apiKey=1f6df3b559f94f9cadab107301ebb8cc&"
          className="News"
          alt="News Image"
        />
      </div>
      <div className='Vote'>
        <div>
        <img
        loading="lazy"
        srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/2ce82bc26ade1c739d9d608ab8b11d9e964f32f41dc2f611f3636da9d9abc742?apiKey=1f6df3b559f94f9cadab107301ebb8cc&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/2ce82bc26ade1c739d9d608ab8b11d9e964f32f41dc2f611f3636da9d9abc742?apiKey=1f6df3b559f94f9cadab107301ebb8cc&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/2ce82bc26ade1c739d9d608ab8b11d9e964f32f41dc2f611f3636da9d9abc742?apiKey=1f6df3b559f94f9cadab107301ebb8cc&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/2ce82bc26ade1c739d9d608ab8b11d9e964f32f41dc2f611f3636da9d9abc742?apiKey=1f6df3b559f94f9cadab107301ebb8cc&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/2ce82bc26ade1c739d9d608ab8b11d9e964f32f41dc2f611f3636da9d9abc742?apiKey=1f6df3b559f94f9cadab107301ebb8cc&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/2ce82bc26ade1c739d9d608ab8b11d9e964f32f41dc2f611f3636da9d9abc742?apiKey=1f6df3b559f94f9cadab107301ebb8cc&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/2ce82bc26ade1c739d9d608ab8b11d9e964f32f41dc2f611f3636da9d9abc742?apiKey=1f6df3b559f94f9cadab107301ebb8cc&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/2ce82bc26ade1c739d9d608ab8b11d9e964f32f41dc2f611f3636da9d9abc742?apiKey=1f6df3b559f94f9cadab107301ebb8cc&"
        className="img"
      />
        </div>
        <div>
          <Link to="/vote" className="VoteButt">ลงคะแนนการเลือกตั้ง</Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
