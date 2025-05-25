export function generateEmbedScript(serverUrl) {
  const scriptPopup = `<script type="module">
  import Chatbot from '${serverUrl}/web.js'
  Chatbot.init({
      chatflowid: 'support-agent',
      apiHost: '${serverUrl}'
  })
</script>`;

  const scriptFull = `<autocampaign-fullchatbot></autocampaign-fullchatbot>
<script type="module">
  import Chatbot from '${serverUrl}/web.js'
  Chatbot.initFull({
      chatflowid: 'support-agent',
      apiHost: '${serverUrl}'
  })
</script>
 <!-- The ChatWidget will be rendered here -->
    <autocampaign-chatwidget 
        chatflowid="support-agent"
        apiHost="${serverUrl}"
        logo="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHJ4PSI2IiBmaWxsPSJ3aGl0ZSIvPjxjaXJjbGUgY3g9IjgiIGN5PSIxMiIgcj0iMyIgZmlsbD0iI0ZGNDg0OCIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMiIGZpbGw9IiNGRkEyMEIiLz48Y2lyY2xlIGN4PSIxNiIgY3k9IjEyIiByPSIzIiBmaWxsPSIjMDBDMTdDIi8+PC9zdmc+"
        title="Welcome to Auto campaign" 
        subtitle="We are here to help you!"
        description="Get the best prices on 2,000,000+ properties, worldwide"
        >
    </autocampaign-chatwidget>

    <script type="module">
        import * as AutoCampaign from '${serverUrl}/web.js'        
    </script>

`;

  const envContext = serverUrl.includes('localhost') ? 'Development' : 'Production';

  console.log('\n\x1b[35m%s\x1b[0m', `=== ${envContext} Environment ===`);
  console.log('\x1b[90m%s\x1b[0m', `Proxy Server URL: ${serverUrl}`);

  console.log('\n\x1b[36m%s\x1b[0m', '=== Popup Chat Embed Script ===');
  console.log('\x1b[33m%s\x1b[0m', scriptPopup);

  console.log('\n\x1b[36m%s\x1b[0m', '=== Full Page Chat Embed Script ===');
  console.log('\x1b[33m%s\x1b[0m', scriptFull);
  console.log('\n');
}
