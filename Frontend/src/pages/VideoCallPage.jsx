import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { v4 as uuidv4 } from "uuid";
import { BiFullscreen } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VideoCallPage = () => {
  const { sessionId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const meetingContainerRef = useRef(null);
  const zegoInstanceRef = useRef(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  // Ensure these values have default fallbacks
  const username = state?.username || "User_" + Math.floor(Math.random() * 1000);
  const topic = state?.topic || "FitBro Session";

  // Request camera and microphone permissions
  const requestPermissions = async () => {
    try {
      // Request camera permission
      const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Stop the stream immediately after getting permission
      videoStream.getTracks().forEach(track => track.stop());
      
      // Request microphone permission
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the stream immediately after getting permission
      audioStream.getTracks().forEach(track => track.stop());
      
      setPermissionsGranted(true);
      return true;
    } catch (error) {
      console.error("Permission error:", error);
      toast.error("Camera and microphone permissions are required for video calls", {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: false,
        className: 'bg-[#00334D] text-white'
      });
      return false;
    }
  };

  // Initialize Zego instance only once
  useEffect(() => {
    // Prevent multiple join attempts
    if (hasJoined || isLeaving) return;
    
    // Use the correct App ID and ServerSecret
    const appId = 801669669; // Your ZegoCloud App ID
    const serverSecret = "bdd60459ed65397e41f6d262a98a5d3b"; // Your ZegoCloud ServerSecret
    
    setIsConnecting(true);
    setConnectionError(null);
    
    // Request permissions before joining
    requestPermissions().then(permissionsOk => {
      if (!permissionsOk) {
        setIsConnecting(false);
        setConnectionError("Camera and microphone permissions are required");
        return;
      }

      try {
        // Generate a unique user ID for this session
        const userId = uuidv4();
        
        // Generate token using ServerSecret
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appId,
          serverSecret,
          sessionId,
          userId,
          username
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zegoInstanceRef.current = zp;

        zp.joinRoom({
          container: meetingContainerRef.current,
          scenario: {
            mode: ZegoUIKitPrebuilt.VideoConference,
            config: {
              role: ZegoUIKitPrebuilt.Host,
            },
          },
          showPreJoinView: true,
          showScreenSharingButton: false, // Disable screen sharing
          showUserList: false, // Disable user list
          showPreviewTitle: true,
          previewViewConfig: {
            title: topic || "FitBro Session",
            video: false,
            audio: false,
          },
          turnOnMicrophoneWhenJoining: false,
          turnOnCameraWhenJoining: false,
          showMyCameraToggleButton: true,
          showMyMicrophoneToggleButton: true,
          showAudioVideoSettingsButton: true,
          onError: (error) => {
            console.error("Zego error:", error);
            setConnectionError(`Connection error: ${error.message || error}`);
            toast.error(`Connection error: ${error.message || error}`, {
              position: "top-right",
              autoClose: 5000,
              closeOnClick: true,
              pauseOnHover: false,
              className: 'bg-[#00334D] text-white'
            });
          },
          onRoomStateChanged: (state) => {
            console.log("Room state changed:", state);
            if (state === "DISCONNECTED") {
              setConnectionError("Disconnected from the room");
            }
          },
          onUserJoin: (user) => {
            console.log("User joined:", user);
            toast.success(`${user.userName} joined the room`, {
              position: "top-right",
              autoClose: 3000,
              closeOnClick: true,
              pauseOnHover: false,
              className: 'bg-[#00334D] text-white'
            });
          },
          onUserLeave: (user) => {
            console.log("User left:", user);
            toast.info(`${user.userName} left the room`, {
              position: "top-right",
              autoClose: 3000,
              closeOnClick: true,
              pauseOnHover: false,
              className: 'bg-[#00334D] text-white'
            });
          }
        });
        
        setHasJoined(true);
        setIsConnecting(false);
      } catch (error) {
        console.error("Error initializing Zego:", error);
        setConnectionError(`Failed to initialize: ${error.message || error}`);
        setIsConnecting(false);
        toast.error(`Failed to initialize: ${error.message || error}`, {
          position: "top-right",
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: false,
          className: 'bg-[#00334D] text-white'
        });
      }
    });

    // Cleanup function - only run when component is unmounting
    return () => {
      // Only clean up if we're actually leaving the page
      if (isLeaving) {
        try {
          if (zegoInstanceRef.current) {
            zegoInstanceRef.current.destroy();
            zegoInstanceRef.current = null;
          }
          if (meetingContainerRef.current) {
            meetingContainerRef.current.innerHTML = "";
          }
        } catch (error) {
          console.error("Error during cleanup:", error);
        }
      }
    };
  }, [sessionId, username, topic, hasJoined, isLeaving]);

  const toggleFullscreen = () => {
    const element = meetingContainerRef.current;
    if (!document.fullscreenElement) {
      element?.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const viewBooking = () => {
    // Navigate to the booking page where the user originally booked
    navigate('/');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sessionId);
    toast.info("Session ID copied to clipboard!", {
      position: "top-right",
      autoClose: 5000,
      closeOnClick: true,
      pauseOnHover: false,
      className: 'bg-[#00334D] text-white'
    });
  };

  const leaveRoom = async () => {
    setIsLeaving(true);
    
    try {
      // Get the Zego instance
      const zgInstance = zegoInstanceRef.current || ZegoUIKitPrebuilt.getInstance();
      
      if (zgInstance) {
        try {
          // First, stop all local streams
          await zgInstance.turnCameraOff();
          await zgInstance.turnMicrophoneOff();
          
          // Leave the room explicitly
          await zgInstance.leaveRoom();
          
          // destroy() will automatically:
          // 1. Leave the room
          // 2. Stop all streams
          // 3. Clean up resources
          // 4. Destroy the instance
          await zgInstance.destroy();
          console.log("Successfully destroyed Zego instance and left room");
        } catch (zegoError) {
          console.error("Error cleaning up Zego:", zegoError);
        }
      }
  
      // Clear the video container
      if (meetingContainerRef.current) {
        meetingContainerRef.current.innerHTML = '';
      }
  
      // Navigate directly to booking page
      navigate('/');
  
    } catch (error) {
      console.error("Error leaving the room:", error);
      // If there's an error, force cleanup and reload
      if (meetingContainerRef.current) {
        meetingContainerRef.current.innerHTML = '';
      }
      navigate('/');
    }
  };

  return (
    <div
      className="room-page flex flex-col min-h-screen w-full text-white"
      style={{
        backgroundImage: 'url("/Night5.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#001022",
      }}
      onError={(e) => {
        console.error("Background image failed to load");
        e.currentTarget.style.backgroundImage = "none";
      }}
    >
      {connectionError && (
        <div className="bg-red-500/80 text-white px-4 py-2 text-center">
          {connectionError}
                </div>
              )}

      {/* Navbar */}
      <nav className="w-full bg-[#001022]/50 p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
        {/* Buttons row - vertical on mobile, horizontal on desktop */}
        <div className="w-full flex flex-col sm:flex-row justify-between sm:justify-between items-center gap-2">
          {/* Left side button */}
          <div className="w-full sm:w-1/3 sm:flex sm:justify-start">
            <button
              onClick={copyToClipboard}
              className="w-full sm:w-auto bg-white text-[#00334D] px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-[14px] sm:text-[15px] font-medium whitespace-nowrap"
            >
              Copy Session ID
            </button>
              </div>

          {/* Right side buttons - stacked on mobile */}
          <div className="w-full sm:w-1/3 flex flex-col sm:flex-row sm:justify-end gap-2">
              <button
              onClick={leaveRoom}
              className="w-full sm:w-auto bg-white text-[#00334D] px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-[14px] sm:text-[15px] font-medium whitespace-nowrap"
              >
              Leave Room
              </button>
                </div>
              </div>

        {/* Topic - centered below buttons on mobile, centered between them on desktop */}
        <div className="w-full sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2 text-center sm:w-auto">
          <span className="text-2xl sm:text-2xl lg:text-3xl font-bold tracking-wide">
            {topic || "FitBro Session"}
          </span>
                    </div>
      </nav>

      {/* Video Conference Section */}
      <div className="flex flex-col p-4 gap-4">
        <div className="relative w-full h-[500px] bg-[#001022]/50 rounded-lg">
          {isConnecting && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
              <div className="text-white text-xl">Connecting to video call...</div>
            </div>
          )}
          {!permissionsGranted && !isConnecting && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-10">
              <div className="text-white text-xl mb-4">Camera and microphone permissions are required</div>
              <button
                onClick={requestPermissions}
                className="bg-white text-[#00334D] px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Grant Permissions
              </button>
            </div>
          )}
          <div
            ref={meetingContainerRef}
            className="w-full h-full"
          ></div>
          <div className="absolute top-4 left-4 flex gap-2 z-10">
              <button
              onClick={toggleFullscreen}
              className="bg-white text-[#00334D] py-2 px-4 rounded-md text-[15px] font-medium hover:bg-gray-100 transition-colors"
              >
              ⛶ Full Screen
              </button>
              <button
              onClick={viewBooking}
              className="bg-white text-[#00334D] py-2 px-4 rounded-md text-[15px] font-medium hover:bg-gray-100 transition-colors"
              >
              EXIT 
              </button>
            </div>
          </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default VideoCallPage;