

// Auto-refresh state management
let autoRefreshEnabled = true;
let refreshInterval = null;

// Function to update circular progress
function updateCircularProgress(elementId, percentage) {
  const circle = document.getElementById(elementId);
  if (circle) {
    const circumference = 2 * Math.PI * 15.9155;
    const strokeDasharray = `${(percentage / 100) * circumference},${circumference}`;
    circle.style.strokeDasharray = strokeDasharray;
  }
}

// Function to toggle auto-refresh
function toggleAutoRefresh() {
  autoRefreshEnabled = !autoRefreshEnabled;
  
  const toggle = document.getElementById('auto-refresh-toggle');
  const slider = document.getElementById('toggle-slider');
  const status = document.getElementById('refresh-status');
  
  if (autoRefreshEnabled) {
    // Enable auto-refresh
    toggle.style.backgroundColor = '#10b981'; // Green
    slider.style.transform = 'translateX(24px)';
    status.textContent = 'Every 2 seconds';
    startAutoRefresh();
  } else {
    // Disable auto-refresh
    toggle.style.backgroundColor = '#374151'; // Dark gray
    slider.style.transform = 'translateX(0)';
    status.textContent = 'Paused';
    stopAutoRefresh();
  }
}

// Function to start auto-refresh
function startAutoRefresh() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
  refreshInterval = setInterval(updateSystemInfo, 2000);
}

// Function to stop auto-refresh
function stopAutoRefresh() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
}

// Function to update status indicators based on usage
function updateStatusIndicator(statusDot, statusText, usage, type = 'cpu') {
  if (usage > 80) {
    statusDot.className = 'w-2 h-2 bg-red-400 rounded-full';
    statusText.textContent = 'High Usage';
    statusText.className = 'text-sm text-red-400';
  } else if (usage > 60) {
    statusDot.className = 'w-2 h-2 bg-yellow-400 rounded-full';
    statusText.textContent = 'Moderate';
    statusText.className = 'text-sm text-yellow-400';
  } else {
    statusDot.className = 'w-2 h-2 bg-green-400 rounded-full';
    statusText.textContent = 'Optimal';
    statusText.className = 'text-sm text-green-400';
  }
}

async function updateSystemInfo() {
  try {
    console.log('Fetching system info...');
    const data = await window.electronAPI.getSystemInfo();
    console.log('System data received:', data);
    
    // Update last refresh timestamp
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    
    // Add refresh indicator to title when auto-refresh is active
    const hostname = document.getElementById('hostname');
    if (hostname && data.hostname) {
      if (autoRefreshEnabled) {
        hostname.textContent = data.hostname;
        hostname.title = `Last updated: ${timeString}`;
      } else {
        hostname.textContent = `${data.hostname} (Paused)`;
        hostname.title = `Data paused at: ${timeString}`;
      }
    }
    // Update Header Information
    if (data.hostname) {
      document.getElementById('username').textContent = data.hostname;
      // Set user avatar to first letter of hostname
      document.getElementById('user-avatar').textContent = data.hostname.charAt(0).toUpperCase();
    }
    
    if (data.uptime) {
      document.getElementById('uptime').textContent = data.uptime;
    }
    
    if (data.osType && data.architecture) {
      document.getElementById('system-info').textContent = `${data.osType} ${data.architecture}`;
    }
    
    // Update CPU Information
    // Update CPU Information
    if (data.cpuUsage !== undefined && data.cpuUsage !== null) {
      // Update CPU model and specs
      if (data.cpuModel) {
        document.getElementById('cpu-model').textContent = data.cpuModel;
        document.getElementById('cpu-cores').textContent = `Cores: ${data.cpuCores}`;
        if (data.cpuSpeed) {
          document.getElementById('cpu-speed').textContent = data.cpuSpeed;
        }
      }
      
      // Update CPU usage percentage
      document.getElementById('cpu-usage').textContent = `${data.cpuUsage.toFixed(0)}%`;
      document.getElementById('cpu-bar').style.width = `${Math.min(data.cpuUsage, 100)}%`;
      
      // Update CPU temperature and circular progress (using usage for the circle)
      if (data.cpuTemperature) {
        document.getElementById('cpu-temp').textContent = `${data.cpuTemperature}°`;
      }
      updateCircularProgress('cpu-circle', data.cpuUsage);
      
      // Update CPU utilization bar color based on usage
      const cpuBar = document.getElementById('cpu-bar');
      if (data.cpuUsage > 80) {
        cpuBar.className = 'bg-red-400 h-2 rounded-full transition-all duration-500';
      } else if (data.cpuUsage > 60) {
        cpuBar.className = 'bg-yellow-400 h-2 rounded-full transition-all duration-500';
      } else {
        cpuBar.className = 'bg-blue-400 h-2 rounded-full transition-all duration-500';
      }
    } else {
      console.warn('CPU usage data is undefined');
    }
    
    // Update Memory Information
    if (data.memoryUsage !== undefined && data.memoryUsage !== null) {
      // Update RAM specs
      document.getElementById('ram-specs').textContent = `${data.totalMemory} GB Total`;
      
      // Update memory circular gauge
      document.getElementById('memory-percentage').textContent = `${data.memoryUsage.toFixed(0)}%`;
      updateCircularProgress('memory-circle', data.memoryUsage);
      
      // Update memory usage
      document.getElementById('memory-usage').textContent = `${data.memoryUsage.toFixed(0)}%`;
      document.getElementById('memory-bar').style.width = `${Math.min(data.memoryUsage, 100)}%`;
      document.getElementById('memory-details').textContent = `${data.usedMemory} GB used of ${data.totalMemory} GB (${data.freeMemory} GB free)`;
      
      // Update memory status indicator
      const memoryStatusDot = document.getElementById('memory-status');
      const memoryStatusText = document.getElementById('memory-status-text');
      updateStatusIndicator(memoryStatusDot, memoryStatusText, data.memoryUsage, 'memory');
      
      // Update memory bar color based on usage
      const memoryBar = document.getElementById('memory-bar');
      if (data.memoryUsage > 80) {
        memoryBar.className = 'bg-red-400 h-2 rounded-full transition-all duration-500';
      } else if (data.memoryUsage > 60) {
        memoryBar.className = 'bg-yellow-400 h-2 rounded-full transition-all duration-500';
      } else {
        memoryBar.className = 'bg-green-400 h-2 rounded-full transition-all duration-500';
      }
    } else {
      console.warn('Memory usage data is undefined');
    }
    
    // Update Storage Information
    if (data.storageUsage !== undefined && data.storageUsage !== null) {
      // Update storage usage percentage in the circular gauge
      document.getElementById('storage-percentage').textContent = `${data.storageUsage.toFixed(0)}%`;
      updateCircularProgress('storage-circle', data.storageUsage);
      
      // Update storage usage text and bar
      document.getElementById('storage-usage').textContent = `${data.storageUsage.toFixed(0)}%`;
      document.getElementById('storage-bar').style.width = `${Math.min(data.storageUsage, 100)}%`;
      
      // Update storage details with real data
      if (data.storageTotalGB && data.storageFreeGB && data.storageUsedGB) {
        document.getElementById('storage-details').textContent = 
          `${data.storageUsedGB} GB used of ${data.storageTotalGB} GB (${data.storageFreeGB} GB free)`;
      } else {
        document.getElementById('storage-details').textContent = 
          `${data.storageUsage.toFixed(0)}% of drive capacity used`;
      }
      
      // Update storage status indicator
      const storageStatusDot = document.getElementById('storage-status');
      const storageStatusText = document.getElementById('storage-status-text');
      updateStatusIndicator(storageStatusDot, storageStatusText, data.storageUsage, 'storage');
      
      // Update storage bar and circle color based on usage
      const storageBar = document.getElementById('storage-bar');
      const storageCircle = document.getElementById('storage-circle');
      
      if (data.storageUsage > 80) {
        storageBar.className = 'bg-red-400 h-2 rounded-full transition-all duration-300';
        storageCircle.className = 'text-red-400 progress-ring';
      } else if (data.storageUsage > 60) {
        storageBar.className = 'bg-yellow-400 h-2 rounded-full transition-all duration-300';
        storageCircle.className = 'text-yellow-400 progress-ring';
      } else {
        storageBar.className = 'bg-purple-400 h-2 rounded-full transition-all duration-300';
        storageCircle.className = 'text-purple-400 progress-ring';
      }
    }
    
    // Update GPU Information
    if (data.gpuName) {
      // Update GPU model and specs
      const gpuDisplayName = data.gpuMemory !== 'Unknown' ? 
        `${data.gpuName} (${data.gpuMemory})` : data.gpuName;
      document.getElementById('gpu-model').textContent = gpuDisplayName;
      
      // Update GPU usage
      if (data.gpuUsage !== undefined) {
        document.getElementById('gpu-usage').textContent = `${data.gpuUsage}%`;
        document.getElementById('gpu-bar').style.width = `${Math.min(data.gpuUsage, 100)}%`;
        
        // Update GPU status indicator
        const gpuStatusDot = document.getElementById('gpu-status');
        const gpuStatusText = document.getElementById('gpu-status-text');
        updateStatusIndicator(gpuStatusDot, gpuStatusText, data.gpuUsage, 'gpu');
        
        // Update GPU bar color based on usage
        const gpuBar = document.getElementById('gpu-bar');
        if (data.gpuUsage > 80) {
          gpuBar.className = 'bg-red-400 h-2 rounded-full transition-all duration-300';
        } else if (data.gpuUsage > 60) {
          gpuBar.className = 'bg-yellow-400 h-2 rounded-full transition-all duration-300';
        } else {
          gpuBar.className = 'bg-blue-400 h-2 rounded-full transition-all duration-300';
        }
      }
      
      // Update GPU temperature and circular progress
      if (data.gpuTemperature !== undefined) {
        document.getElementById('gpu-temp').textContent = `${data.gpuTemperature}°`;
        updateCircularProgress('gpu-circle', data.gpuTemperature);
      }
    }
    
    // Update Network Information
    if (data.networkSSID) {
      // Update network name
      document.getElementById('network-name').textContent = data.networkSSID;
      
      // Update connection status
      const networkStatusDot = document.getElementById('network-status-dot');
      const networkStatusText = document.getElementById('network-status-text');
      
      if (data.networkConnected) {
        networkStatusDot.className = 'w-2 h-2 bg-green-400 rounded-full';
        networkStatusText.textContent = 'Connected';
        networkStatusText.className = 'text-sm text-green-400';
      } else {
        networkStatusDot.className = 'w-2 h-2 bg-red-400 rounded-full';
        networkStatusText.textContent = 'Disconnected';
        networkStatusText.className = 'text-sm text-red-400';
      }
      
      // Update signal strength
      if (data.networkSignal !== undefined) {
        document.getElementById('signal-strength').textContent = `${data.networkSignal}%`;
        document.getElementById('signal-bar').style.width = `${data.networkSignal}%`;
        
        // Color code signal strength
        const signalBar = document.getElementById('signal-bar');
        if (data.networkSignal > 70) {
          signalBar.className = 'bg-green-400 h-2 rounded-full transition-all duration-300';
        } else if (data.networkSignal > 50) {
          signalBar.className = 'bg-yellow-400 h-2 rounded-full transition-all duration-300';
        } else {
          signalBar.className = 'bg-red-400 h-2 rounded-full transition-all duration-300';
        }
      }
      
      // Update network speeds
      if (data.downloadSpeed !== undefined && data.uploadSpeed !== undefined) {
        document.getElementById('download-speed').textContent = `↓ ${data.downloadSpeed} MB/s`;
        document.getElementById('upload-speed').textContent = `↑ ${data.uploadSpeed} MB/s`;
      }
      
      // Update network type
      if (data.networkType) {
        document.getElementById('network-type').textContent = `Type: ${data.networkType}`;
      }
    }
    
    // Legacy network info fallback
    if (data.networkStatus) {
      console.log('Network status:', data.networkStatus);
      // You can add network status updates here
    }
    
  } catch (error) {
    console.error('Error fetching system info:', error);
    document.getElementById('cpu-usage').textContent = 'Error';
    document.getElementById('memory-usage').textContent = 'Error';
    document.getElementById('memory-details').textContent = 'Error loading memory data';
    document.getElementById('hostname').textContent = 'Error loading hostname';
  }
}

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
  // Set up window controls
  const minimizeBtn = document.getElementById('minimize-btn');
  const closeBtn = document.getElementById('close-btn');
  
  if (minimizeBtn) {
    minimizeBtn.addEventListener('click', async () => {
      try {
        await window.electronAPI.minimizeWindow();
      } catch (error) {
        console.error('Error minimizing window:', error);
      }
    });
  }
  
  if (closeBtn) {
    closeBtn.addEventListener('click', async () => {
      try {
        await window.electronAPI.closeWindow();
      } catch (error) {
        console.error('Error closing window:', error);
      }
    });
  }
  
  // Set up auto-refresh toggle
  const autoRefreshToggle = document.getElementById('auto-refresh-toggle');
  if (autoRefreshToggle) {
    // Initialize toggle to "on" state
    autoRefreshToggle.style.backgroundColor = '#10b981'; // Green
    document.getElementById('toggle-slider').style.transform = 'translateX(24px)';
    
    // Add click event listener
    autoRefreshToggle.addEventListener('click', toggleAutoRefresh);
  }
  
  // Add hover effects to cards
  const cards = document.querySelectorAll('.bg-dark-800');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
      this.style.transition = 'transform 0.2s ease';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
  
  // Add Malwarebytes launcher functionality
  const launchMalwarebytesBtn = document.getElementById('launch-malwarebytes-btn');
  if (launchMalwarebytesBtn) {
    launchMalwarebytesBtn.addEventListener('click', async () => {
      const button = document.getElementById('launch-malwarebytes-btn');
      const buttonText = document.getElementById('launch-btn-text');
      const statusElement = document.getElementById('malwarebytes-status');
      
      // Update UI to show loading state
      button.disabled = true;
      buttonText.textContent = 'Launching...';
      statusElement.textContent = 'Starting Malwarebytes...';
      statusElement.className = 'text-sm text-yellow-400';
      
      try {
        const result = await window.electronAPI.launchMalwarebytes();
        
        if (result.success) {
          // Success state
          statusElement.textContent = 'Malwarebytes launched successfully!';
          statusElement.className = 'text-sm text-green-400';
          buttonText.textContent = 'Launch Malwarebytes';
          
          // Reset after 3 seconds
          setTimeout(() => {
            statusElement.textContent = 'Ready to launch';
            statusElement.className = 'text-sm text-blue-400';
            button.disabled = false;
          }, 3000);
        } else {
          // Error state
          statusElement.textContent = result.message;
          statusElement.className = 'text-sm text-red-400';
          buttonText.textContent = 'Launch Malwarebytes';
          
          // Reset after 5 seconds
          setTimeout(() => {
            statusElement.textContent = 'Ready to launch';
            statusElement.className = 'text-sm text-blue-400';
            button.disabled = false;
          }, 5000);
        }
      } catch (error) {
        // Error handling
        statusElement.textContent = 'Failed to launch Malwarebytes';
        statusElement.className = 'text-sm text-red-400';
        buttonText.textContent = 'Launch Malwarebytes';
        button.disabled = false;
      }
    });
  }
  
  // Initial load and start auto-refresh
  updateSystemInfo();
  startAutoRefresh();
});

// Remove the old manual interval and initial call since we now manage it through the toggle system