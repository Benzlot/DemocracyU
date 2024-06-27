import '../components-style/ResultP.css'

const ResultsPage = () => {
    return (
    <div className='Result'>
      <img
        loading="lazy"
        srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/4123dc5fcfaad26a9e5a99ac9310e751550c6b04072cde979964dd3ea16ab3cc?apiKey=1f6df3b559f94f9cadab107301ebb8cc&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/4123dc5fcfaad26a9e5a99ac9310e751550c6b04072cde979964dd3ea16ab3cc?apiKey=1f6df3b559f94f9cadab107301ebb8cc&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/4123dc5fcfaad26a9e5a99ac9310e751550c6b04072cde979964dd3ea16ab3cc?apiKey=1f6df3b559f94f9cadab107301ebb8cc&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/4123dc5fcfaad26a9e5a99ac9310e751550c6b04072cde979964dd3ea16ab3cc?apiKey=1f6df3b559f94f9cadab107301ebb8cc&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/4123dc5fcfaad26a9e5a99ac9310e751550c6b04072cde979964dd3ea16ab3cc?apiKey=1f6df3b559f94f9cadab107301ebb8cc&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/4123dc5fcfaad26a9e5a99ac9310e751550c6b04072cde979964dd3ea16ab3cc?apiKey=1f6df3b559f94f9cadab107301ebb8cc&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/4123dc5fcfaad26a9e5a99ac9310e751550c6b04072cde979964dd3ea16ab3cc?apiKey=1f6df3b559f94f9cadab107301ebb8cc&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/4123dc5fcfaad26a9e5a99ac9310e751550c6b04072cde979964dd3ea16ab3cc?apiKey=1f6df3b559f94f9cadab107301ebb8cc&"
        className="ReImg"
      />
      <div className='ResultName'><h1>ผลคะแนนการเลือกตั้งอย่างไม่เป็นทางการ</h1></div>
    </div>
  );
};

export default ResultsPage;
