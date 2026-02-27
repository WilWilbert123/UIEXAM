import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useState } from 'react';
import { Dimensions, PanResponder, StyleSheet, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const UIExamScreen = () => {
  const videoSource = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  
  // 1. MAIN PLAYER
  const mainPlayer = useVideoPlayer(videoSource, p => {
    p.loop = true;
    p.play();
  });

  // 2. THUMBNAIL PLAYER (The background strip)
  const thumbPlayer = useVideoPlayer(videoSource, p => {
    p.muted = true;
    p.pause();
  });

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Sync the time and duration manually
  useEffect(() => {
    const interval = setInterval(() => {
      if (mainPlayer) {
        setCurrentTime(mainPlayer.currentTime);
        // Only set duration once
        if (mainPlayer.duration > 0 && duration === 0) {
          setDuration(mainPlayer.duration);
        }
      }
    }, 100);
    return () => clearInterval(interval);
  }, [mainPlayer, duration]);

  // Warm-up logic: Seek slightly forward so we don't start on a black frame
  useEffect(() => {
    const timeout = setTimeout(() => {
        if (thumbPlayer) thumbPlayer.currentTime = 2; // Jump to 2 seconds for a clear bunny shot
    }, 1000);
    return () => clearTimeout(timeout);
  }, [thumbPlayer]);

  // 3. DRAG LOGIC (PanResponder)
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt) => {
      const touchX = evt.nativeEvent.locationX;
      const percentage = Math.max(0, Math.min(touchX / SCREEN_WIDTH, 1));
      const seekTime = percentage * duration;
      
      // Update both players in real-time
      mainPlayer.currentTime = seekTime;
      thumbPlayer.currentTime = seekTime;
    },
  });

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <View style={styles.container}>
      {/* THE MAIN VIDEO */}
      <VideoView 
        style={styles.mainVideo} 
        player={mainPlayer} 
        contentFit="contain" 
      />

      <View style={styles.controls}>
        {/* THE DYNAMIC THUMBNAIL SEEKBAR */}
        <View style={styles.seekBarContainer} {...panResponder.panHandlers}>
          
          <VideoView 
            style={styles.thumbnailVideo} 
            player={thumbPlayer} 
            nativeControls={false}
            contentFit="cover"
          />

          {/* RED PROGRESS BAR OVERLAY */}
          <View style={[styles.progressOverlay, { width: `${progressPercent}%` }]} />
          
        </View>
        
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000' ,
     
  },
  mainVideo: { 
    width: '100%', 
    height: 250 
  },
  
  seekBarContainer: { 
    height: 60, 
    width: '100%', 
    backgroundColor: '#1a1a1a', 
    overflow: 'hidden',
    position: 'relative',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#333'
  },
 thumbnailVideo: { 
    position: 'absolute',  
    top: 0,
    left: 0,
    width: '100%', 
    height: '400%',  
    opacity: 0.7 
  },
  progressOverlay: { 
    position: 'absolute', 
    left: 0, 
    top: 0, 
    bottom: 0, 
    backgroundColor: 'rgba(255, 0, 0, 0.4)', 
    borderRightWidth: 5, 
    borderRightColor: 'red' 
  },
 
});

export default UIExamScreen;