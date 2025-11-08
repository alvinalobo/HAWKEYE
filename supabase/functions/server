import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

// Root endpoint
app.get('/make-server-07bfe634/', (c) => {
  return c.json({ 
    message: 'HAWKEYE Backend Server', 
    version: '1.0.0',
    status: 'operational'
  });
});

// ===== STREAM SESSION ENDPOINTS =====

// Create a new stream session
app.post('/make-server-07bfe634/stream-session', async (c) => {
  try {
    const body = await c.req.json();
    const { userId, sessionId, developerId, token, status } = body;

    if (!userId || !sessionId || !developerId || !token) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const sessionData = {
      userId,
      sessionId,
      developerId,
      token,
      status,
      createdAt: new Date().toISOString(),
      messages: []
    };

    await kv.set(`stream_session:${sessionId}`, JSON.stringify(sessionData));
    await kv.set(`user_sessions:${userId}:${sessionId}`, JSON.stringify(sessionData));

    console.log(`Stream session created: ${sessionId} for user ${userId}`);
    
    return c.json({ 
      success: true, 
      sessionId,
      message: 'Stream session created successfully' 
    });
  } catch (error: any) {
    console.error('Error creating stream session:', error);
    return c.json({ error: `Failed to create stream session: ${error.message}` }, 500);
  }
});

// Update stream session
app.put('/make-server-07bfe634/stream-session/:sessionId', async (c) => {
  try {
    const sessionId = c.req.param('sessionId');
    const body = await c.req.json();
    const { status, endTime } = body;

    const sessionKey = `stream_session:${sessionId}`;
    const existingData = await kv.get(sessionKey);

    if (!existingData) {
      return c.json({ error: 'Session not found' }, 404);
    }

    const sessionData = JSON.parse(existingData);
    sessionData.status = status || sessionData.status;
    if (endTime) {
      sessionData.endTime = endTime;
    }

    await kv.set(sessionKey, JSON.stringify(sessionData));

    console.log(`Stream session updated: ${sessionId} - Status: ${status}`);

    return c.json({ 
      success: true, 
      message: 'Stream session updated successfully' 
    });
  } catch (error: any) {
    console.error('Error updating stream session:', error);
    return c.json({ error: `Failed to update stream session: ${error.message}` }, 500);
  }
});

// Get stream session
app.get('/make-server-07bfe634/stream-session/:sessionId', async (c) => {
  try {
    const sessionId = c.req.param('sessionId');
    const sessionData = await kv.get(`stream_session:${sessionId}`);

    if (!sessionData) {
      return c.json({ error: 'Session not found' }, 404);
    }

    return c.json({ 
      success: true, 
      session: JSON.parse(sessionData) 
    });
  } catch (error: any) {
    console.error('Error retrieving stream session:', error);
    return c.json({ error: `Failed to retrieve stream session: ${error.message}` }, 500);
  }
});

// ===== CHAT MESSAGE ENDPOINTS =====

// Send a message in a stream session
app.post('/make-server-07bfe634/stream-message', async (c) => {
  try {
    const body = await c.req.json();
    const { sessionId, message, sender } = body;

    if (!sessionId || !message || !sender) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const sessionKey = `stream_session:${sessionId}`;
    const sessionData = await kv.get(sessionKey);

    if (!sessionData) {
      return c.json({ error: 'Session not found' }, 404);
    }

    const session = JSON.parse(sessionData);
    const messageData = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sender,
      message,
      timestamp: new Date().toISOString()
    };

    if (!session.messages) {
      session.messages = [];
    }
    session.messages.push(messageData);

    await kv.set(sessionKey, JSON.stringify(session));

    console.log(`Message sent in session ${sessionId} by ${sender}`);

    return c.json({ 
      success: true, 
      messageId: messageData.id,
      message: 'Message sent successfully' 
    });
  } catch (error: any) {
    console.error('Error sending message:', error);
    return c.json({ error: `Failed to send message: ${error.message}` }, 500);
  }
});

// Get messages for a stream session
app.get('/make-server-07bfe634/stream-message/:sessionId', async (c) => {
  try {
    const sessionId = c.req.param('sessionId');
    const sessionData = await kv.get(`stream_session:${sessionId}`);

    if (!sessionData) {
      return c.json({ error: 'Session not found' }, 404);
    }

    const session = JSON.parse(sessionData);
    return c.json({ 
      success: true, 
      messages: session.messages || [] 
    });
  } catch (error: any) {
    console.error('Error retrieving messages:', error);
    return c.json({ error: `Failed to retrieve messages: ${error.message}` }, 500);
  }
});

// ===== PACKET DATA ENDPOINTS =====

// Store packet capture data
app.post('/make-server-07bfe634/packets', async (c) => {
  try {
    const body = await c.req.json();
    const { userId, packets, timestamp } = body;

    if (!userId || !packets) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const packetKey = `packets:${userId}:${timestamp || Date.now()}`;
    await kv.set(packetKey, JSON.stringify({
      userId,
      packets,
      timestamp: timestamp || new Date().toISOString(),
      count: packets.length
    }));

    console.log(`Stored ${packets.length} packets for user ${userId}`);

    return c.json({ 
      success: true, 
      message: `Stored ${packets.length} packets` 
    });
  } catch (error: any) {
    console.error('Error storing packets:', error);
    return c.json({ error: `Failed to store packets: ${error.message}` }, 500);
  }
});

// Get packet data for a user
app.get('/make-server-07bfe634/packets/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const packets = await kv.getByPrefix(`packets:${userId}:`);

    return c.json({ 
      success: true, 
      packets: packets.map(p => JSON.parse(p))
    });
  } catch (error: any) {
    console.error('Error retrieving packets:', error);
    return c.json({ error: `Failed to retrieve packets: ${error.message}` }, 500);
  }
});

// ===== THREAT DATA ENDPOINTS =====

// Store threat detection
app.post('/make-server-07bfe634/threats', async (c) => {
  try {
    const body = await c.req.json();
    const { userId, threat, severity, timestamp } = body;

    if (!userId || !threat) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const threatId = `threat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const threatData = {
      id: threatId,
      userId,
      threat,
      severity: severity || 'medium',
      timestamp: timestamp || new Date().toISOString(),
      status: 'active'
    };

    await kv.set(`threat:${threatId}`, JSON.stringify(threatData));
    await kv.set(`user_threats:${userId}:${threatId}`, JSON.stringify(threatData));

    console.log(`Threat detected for user ${userId}: ${threat}`);

    return c.json({ 
      success: true, 
      threatId,
      message: 'Threat logged successfully' 
    });
  } catch (error: any) {
    console.error('Error storing threat:', error);
    return c.json({ error: `Failed to store threat: ${error.message}` }, 500);
  }
});

// Get threats for a user
app.get('/make-server-07bfe634/threats/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const threats = await kv.getByPrefix(`user_threats:${userId}:`);

    return c.json({ 
      success: true, 
      threats: threats.map(t => JSON.parse(t))
    });
  } catch (error: any) {
    console.error('Error retrieving threats:', error);
    return c.json({ error: `Failed to retrieve threats: ${error.message}` }, 500);
  }
});

// ===== APP MONITORING ENDPOINTS =====

// Store app network data
app.post('/make-server-07bfe634/app-data', async (c) => {
  try {
    const body = await c.req.json();
    const { userId, appPackage, packets, dataUsage, timestamp } = body;

    if (!userId || !appPackage) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const dataKey = `app_data:${userId}:${appPackage}:${timestamp || Date.now()}`;
    await kv.set(dataKey, JSON.stringify({
      userId,
      appPackage,
      packets: packets || 0,
      dataUsage: dataUsage || 0,
      timestamp: timestamp || new Date().toISOString()
    }));

    return c.json({ 
      success: true, 
      message: 'App data stored successfully' 
    });
  } catch (error: any) {
    console.error('Error storing app data:', error);
    return c.json({ error: `Failed to store app data: ${error.message}` }, 500);
  }
});

// Get app data for a user
app.get('/make-server-07bfe634/app-data/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const appData = await kv.getByPrefix(`app_data:${userId}:`);

    return c.json({ 
      success: true, 
      appData: appData.map(d => JSON.parse(d))
    });
  } catch (error: any) {
    console.error('Error retrieving app data:', error);
    return c.json({ error: `Failed to retrieve app data: ${error.message}` }, 500);
  }
});

// ===== MODIFICATION LOG ENDPOINTS =====

// Store modification log
app.post('/make-server-07bfe634/modification-log', async (c) => {
  try {
    const body = await c.req.json();
    const { userId, modification } = body;

    if (!userId || !modification) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const logId = `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const logData = {
      id: logId,
      userId,
      ...modification,
      timestamp: new Date().toISOString()
    };

    await kv.set(`mod_log:${logId}`, JSON.stringify(logData));
    await kv.set(`user_mod_logs:${userId}:${logId}`, JSON.stringify(logData));

    console.log(`Modification logged for user ${userId}: ${logId}`);

    return c.json({ 
      success: true, 
      logId,
      message: 'Modification logged successfully' 
    });
  } catch (error: any) {
    console.error('Error storing modification log:', error);
    return c.json({ error: `Failed to store modification log: ${error.message}` }, 500);
  }
});

// Get modification logs for a user
app.get('/make-server-07bfe634/modification-log/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const logs = await kv.getByPrefix(`user_mod_logs:${userId}:`);

    return c.json({ 
      success: true, 
      logs: logs.map(l => JSON.parse(l))
    });
  } catch (error: any) {
    console.error('Error retrieving modification logs:', error);
    return c.json({ error: `Failed to retrieve modification logs: ${error.message}` }, 500);
  }
});

// Health check endpoint
app.get('/make-server-07bfe634/health', (c) => {
  return c.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString() 
  });
});

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ 
    error: 'Internal server error', 
    message: err.message 
  }, 500);
});

// Start server
Deno.serve(app.fetch);
