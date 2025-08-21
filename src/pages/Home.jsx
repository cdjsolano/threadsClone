import Feed from "../components/Feed/Feed.jsx";
import "../styles/threads-feed.css";

function Home() {
  return (
    <div className="containerbkg">
      <div className="parati"><p>Para ti</p></div>
      
        <div className="welcome">
          <Feed />
        
      </div>
    </div>
  );
}

export default Home;
