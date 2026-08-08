const M3U_URL =
  "https://raw.githubusercontent.com/pedromm90/Listados-IPTV-Actualizables/refs/heads/main/LISTADO_M3U.m3u";

// Proxy helper: routes requests through /api/proxy on HTTPS to avoid Mixed Content blocking
function proxyUrl(url) {
  if (window.location.protocol === "https:" && url.startsWith("http:")) {
    return `/api/proxy?url=${encodeURIComponent(url)}`;
  }
  return url;
}

// Diccionario de logotipos CDN garantizados (TV-Logos Repository CDN)
// Importa el diccionario de logotipos desde el archivo channel_logos.js

const KNOWN_LOGOS = {
  dsports:
    "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/world-latin-america/dsports-lam.png",
  "a&e":
    "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/a-and-e-ar.png",
  amc: "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/amc-ar.png",
  axn: "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/axn-ar.png",
  animal:
    "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/canada/animal-planet-hd-ca.png",
  cinecanal:
    "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/mexico/cinecanal-mx.png",
  cnne: "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/united-states/cnn-us.png",
  cpremier:
    "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/cinemax-ar.png",
  cmx: "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/cinemax-ar.png",
  dhe: "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/amc-ar.png",
  disctheater:
    "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/discovery-channel-ar.png",
  discovery:
    "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/discovery-channel-ar.png",
  discid:
    "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/discovery-channel-ar.png",
  disckids:
    "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/discovery-kids-ar.png",
  discworld:
    "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/discovery-channel-ar.png",
  discjr:
    "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/discovery-kids-ar.png",
  espn4:
    "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/espn-extra-ar.png",
  espn2:
    "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/espn-2-ar.png",
  espn3:
    "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/espn-3-ar.png",
  espn5:
    "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/espn-extra-ar.png",
  espn6:
    "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/espn-ar.png",
  espn7:
    "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/espn-ar.png",
  espnhd:
    "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/espn-ar.png",
  espn: "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/united-states/espn-us.png",
  espnpremium:
    "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/espn-premium-ar.png",
  fx: "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/fx-ar.png",
  gold: "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/united-kingdom/gold-uk.png",
  hbofamily:
    "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/hbo-family-ar.png",
  hbohd:
    "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/hbo-ar.png",
  hboplus:
    "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/hbo-plus-ar.png",
  hboxtreme:
    "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/hbo-xtreme-ar.png",
  hbo2: "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/hbo-2-ar.png",
  hbo: "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/united-states/hbo-us.png",
  history:
    "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/history-channel-ar.png",
  hh: "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/history-channel-2-ar.png",
  natgeo:
    "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/national-geographic-ar.png",
  sony: "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/sony-channel-ar.png",
  space:
    "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/space-ar.png",
  star: "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/star-channel-ar.png",
  "studio universal":
    "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/studio-universal-ar.png",
  "tnt series":
    "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/tnt-series-ar.png",
  tnt: "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/tnt-ar.png",
  universal:
    "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/universal-tv-ar.png",
  univision:
    "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/united-states/univision-us.png",
  warner:
    "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/argentina/warner-channel-ar.png",
};

function resolveChannelLogo(tvgLogo, tvgId, tvgName, name) {
  const keysToTry = [
    (tvgId || "").toLowerCase().trim(),
    (tvgName || "").toLowerCase().trim(),
    (name || "").toLowerCase().trim(),
  ];

  // 1. Priorizar coincidencia en nuestro mapa de CDN validado
  for (const rawKey of keysToTry) {
    if (!rawKey) continue;
    for (const [knownKey, logoUrl] of Object.entries(KNOWN_LOGOS)) {
      if (rawKey.includes(knownKey)) {
        return logoUrl;
      }
    }
  }

  // 2. Si viene un tvgLogo en el M3U y no es wikimedia roto, probarlo
  if (tvgLogo && tvgLogo.trim() !== "" && !tvgLogo.includes("wikimedia.org")) {
    return tvgLogo.trim();
  }

  return "";
}

let channels = [];
let currentHls = null;
let activeChannelIndex = -1;

// DOM Elements
const videoPlayer = document.getElementById("video-player");
const playerLoading = document.getElementById("player-loading");
const playerStatus = document.getElementById("player-status");
const playerStatusText = document.getElementById("player-status-text");
const retryBtn = document.getElementById("retry-btn");

const currentLogo = document.getElementById("current-channel-logo");
const currentName = document.getElementById("current-channel-name");
const currentGroup = document.getElementById("current-channel-group");
const currentId = document.getElementById("current-channel-id");
const metaTvgName = document.getElementById("meta-tvg-name");

const channelsContainer = document.getElementById("channels-container");
const channelCountEl = document.getElementById("channel-count");
const searchInput = document.getElementById("search-input");
const groupSelect = document.getElementById("group-select");

// Set copyright year
document.getElementById("copyright").innerText = new Date().getFullYear();

// Initialize Lucide icons
lucide.createIcons();

// Parse M3U line by line capturing metadata
function parseM3U(m3uText) {
  const lines = m3uText.split(/\r?\n/);
  const parsedChannels = [];
  let currentMetadata = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (line.startsWith("#EXTINF:")) {
      // Extract attributes using regex
      const tvgIdMatch = line.match(/tvg-id="([^"]*)"/i);
      const tvgNameMatch = line.match(/tvg-name="([^"]*)"/i);
      const tvgLogoMatch = line.match(/tvg-logo="([^"]*)"/i);
      const groupTitleMatch = line.match(/group-title="([^"]*)"/i);

      // Channel name is after the last comma
      const commaIndex = line.lastIndexOf(",");
      const name =
        commaIndex !== -1
          ? line.substring(commaIndex + 1).trim()
          : "Canal sin nombre";

      const tvgLogoVal = tvgLogoMatch ? tvgLogoMatch[1] : "";

      currentMetadata = {
        name: name,
        tvgId: tvgIdMatch ? tvgIdMatch[1] : "",
        tvgName: tvgNameMatch ? tvgNameMatch[1] : "",
        logo: resolveChannelLogo(
          tvgLogoVal,
          tvgIdMatch ? tvgIdMatch[1] : "",
          tvgNameMatch ? tvgNameMatch[1] : "",
          name,
        ),
        group: groupTitleMatch ? groupTitleMatch[1] : "General",
      };
    } else if (!line.startsWith("#") && currentMetadata) {
      // It's a stream URL
      currentMetadata.url = line;
      parsedChannels.push(currentMetadata);
      currentMetadata = null;
    }
  }
  return parsedChannels;
}

// Populate group filter dropdown
function updateGroupDropdown(channelList) {
  const groups = new Set();
  channelList.forEach((ch) => {
    if (ch.group) groups.add(ch.group);
  });

  // Clear existing options except ALL
  groupSelect.innerHTML = '<option value="ALL">Todas las Categorías</option>';
  Array.from(groups)
    .sort()
    .forEach((group) => {
      const opt = document.createElement("option");
      opt.value = group;
      opt.textContent = group;
      groupSelect.appendChild(opt);
    });
}

// Render channels list UI
function renderChannels(channelList) {
  channelsContainer.innerHTML = "";
  channelCountEl.textContent = `${channelList.length} canal${channelList.length !== 1 ? "es" : ""}`;

  if (channelList.length === 0) {
    channelsContainer.innerHTML = `
            <div class="text-center py-12 text-gray-500">
              <i data-lucide="tv-off" class="w-10 h-10 mx-auto mb-2 opacity-50"></i>
              <p>No se encontraron canales</p>
            </div>
          `;
    lucide.createIcons();
    return;
  }

  channelList.forEach((ch) => {
    const originalIndex = channels.indexOf(ch);
    const isSelected = originalIndex === activeChannelIndex;

    const item = document.createElement("div");
    item.className = `flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border ${
      isSelected
        ? "bg-blue-600/20 border-blue-500/80 text-white shadow-md shadow-blue-950/50"
        : "bg-gray-800/60 hover:bg-gray-800 border-gray-800 text-gray-300 hover:text-white"
    }`;

    const fallbackLogo = "https://via.placeholder.com/50?text=TV";
    const logoSrc = ch.logo ? ch.logo : fallbackLogo;

    item.innerHTML = `
            <div class="w-10 h-10 bg-gray-900 rounded-lg p-1 flex items-center justify-center flex-shrink-0 border border-gray-700/60">
              <img src="${logoSrc}" alt="${ch.name}" class="max-w-full max-h-full object-contain" onerror="this.onerror=null; this.src='${fallbackLogo}';" />
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="font-medium text-sm truncate">${ch.name}</h4>
              <p class="text-xs text-gray-400 truncate">${ch.group || "Sin Categoría"}</p>
            </div>
            ${isSelected ? '<i data-lucide="play-circle" class="w-5 h-5 text-blue-400 flex-shrink-0"></i>' : ""}
          `;

    item.addEventListener("click", () => {
      playChannel(originalIndex);
    });

    channelsContainer.appendChild(item);
  });

  lucide.createIcons();
}

// Filter function
function filterChannels() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedGroup = groupSelect.value;

  const filtered = channels.filter((ch) => {
    const matchesSearch =
      ch.name.toLowerCase().includes(searchTerm) ||
      (ch.tvgName && ch.tvgName.toLowerCase().includes(searchTerm));
    const matchesGroup = selectedGroup === "ALL" || ch.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  renderChannels(filtered);
}

// Play channel by index
function playChannel(index) {
  if (index < 0 || index >= channels.length) return;

  activeChannelIndex = index;
  const channel = channels[index];

  // Update UI details
  currentName.textContent = channel.name;
  currentGroup.textContent = channel.group || "General";
  currentId.textContent = channel.tvgId ? `ID: ${channel.tvgId}` : "ID: N/A";
  metaTvgName.textContent = channel.tvgName || channel.name;

  const logoToSet =
    channel.logo ||
    resolveChannelLogo("", channel.tvgId, channel.tvgName, channel.name);
  currentLogo.src = logoToSet || "https://via.placeholder.com/80?text=TV";
  currentLogo.onerror = function () {
    this.onerror = null;
    this.src = "https://via.placeholder.com/80?text=TV";
  };

  // Re-render list to show active state highlight
  filterChannels();

  // Load stream into player
  loadStream(channel.url);
}

// Load stream into HLS player or native video tag
function loadStream(url) {
  playerStatus.classList.add("hidden");
  playerLoading.classList.remove("hidden");

  if (currentHls) {
    currentHls.destroy();
    currentHls = null;
  }

  // Route the main manifest URL through the proxy if needed
  const streamUrl = proxyUrl(url);

  if (Hls.isSupported()) {
    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      manifestLoadingTimeOut: 15000,
      levelLoadingTimeOut: 15000,
      fragLoadingTimeOut: 25000,
      // Route ALL sub-requests (segments, keys, etc.) through the proxy too
      xhrSetup: function (xhr, requestUrl) {
        const proxied = proxyUrl(requestUrl);
        if (proxied !== requestUrl) {
          xhr.open("GET", proxied, true);
        }
      },
    });
    currentHls = hls;

    hls.loadSource(streamUrl);
    hls.attachMedia(videoPlayer);

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      playerLoading.classList.add("hidden");
      videoPlayer.play().catch((e) => console.log("Autoplay prevented:", e));
    });

    hls.on(Hls.Events.ERROR, (event, data) => {
      if (data.fatal) {
        playerLoading.classList.add("hidden");
        showPlayerError(
          "No se pudo reproducir la señal en vivo. Es posible que la emisión esté fuera de línea o el servidor no responda.",
        );
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            console.error("Fatal network error:", data);
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            console.error("Fatal media error, trying to recover...");
            hls.recoverMediaError();
            break;
          default:
            hls.destroy();
            break;
        }
      }
    });
  } else if (videoPlayer.canPlayType("application/vnd.apple.mpegurl")) {
    videoPlayer.src = streamUrl;
    videoPlayer.addEventListener("loadedmetadata", () => {
      playerLoading.classList.add("hidden");
      videoPlayer.play();
    });
    videoPlayer.addEventListener("error", () => {
      playerLoading.classList.add("hidden");
      showPlayerError("Error al cargar la señal de video.");
    });
  } else {
    playerLoading.classList.add("hidden");
    showPlayerError(
      "Su navegador no soporta la reproducción de este formato (HLS).",
    );
  }
}

function showPlayerError(message) {
  playerStatusText.textContent = message;
  playerStatus.classList.remove("hidden");
}

// Mobile Hamburger Menu Logic
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const menuIconOpen = document.getElementById("menu-icon-open");
const menuIconClose = document.getElementById("menu-icon-close");

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener("click", () => {
    const isHidden = mobileMenu.classList.contains("hidden");
    if (isHidden) {
      mobileMenu.classList.remove("hidden");
      mobileMenu.classList.add("flex");
      menuIconOpen.classList.add("hidden");
      menuIconClose.classList.remove("hidden");
    } else {
      mobileMenu.classList.add("hidden");
      mobileMenu.classList.remove("flex");
      menuIconOpen.classList.remove("hidden");
      menuIconClose.classList.add("hidden");
    }
  });
}

// Copy M3U URL button logic
const copyM3uBtn = document.getElementById("copy-m3u-btn");
const copyBtnText = document.getElementById("copy-btn-text");

copyM3uBtn.addEventListener("click", async () => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(M3U_URL);
    } else {
      // Fallback for non-https or older browser environments
      const textArea = document.createElement("textarea");
      textArea.value = M3U_URL;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }

    // Interactive feedback
    copyM3uBtn.classList.remove(
      "bg-blue-600/20",
      "text-blue-400",
      "border-blue-500/30",
    );
    copyM3uBtn.classList.add(
      "bg-emerald-600",
      "text-white",
      "border-emerald-500",
    );
    copyBtnText.textContent = "¡Copiado!";

    setTimeout(() => {
      copyM3uBtn.classList.remove(
        "bg-emerald-600",
        "text-white",
        "border-emerald-500",
      );
      copyM3uBtn.classList.add(
        "bg-blue-600/20",
        "text-blue-400",
        "border-blue-500/30",
      );
      copyBtnText.textContent = "Copiar M3U";
    }, 2000);
  } catch (err) {
    console.error("Error al copiar:", err);
  }
});

// External M3U Modal Logic & Controls
const openM3uModalBtn = document.getElementById("open-m3u-modal-btn");
const closeM3uModalBtn = document.getElementById("close-m3u-modal-btn");
const m3uModal = document.getElementById("m3u-modal");
const m3uUrlInput = document.getElementById("m3u-url-input");
const submitM3uBtn = document.getElementById("submit-m3u-btn");
const submitBtnSpinner = document.getElementById("submit-btn-spinner");
const submitBtnText = document.getElementById("submit-btn-text");
const resetDefaultM3uBtn = document.getElementById("reset-default-m3u-btn");

const modalStatusMsg = document.getElementById("modal-status-msg");
const modalStatusText = document.getElementById("modal-status-text");

function openModal() {
  m3uModal.classList.remove("hidden");
  hideModalStatus();
}

function closeModal() {
  m3uModal.classList.add("hidden");
}

function showModalStatus(message, type = "error") {
  modalStatusMsg.className = `p-3 rounded-xl text-xs font-medium border flex items-start space-x-2 ${
    type === "error"
      ? "bg-rose-950/60 border-rose-800/80 text-rose-300"
      : "bg-emerald-950/60 border-emerald-800/80 text-emerald-300"
  }`;
  modalStatusText.textContent = message;
  modalStatusMsg.classList.remove("hidden");
  lucide.createIcons();
}

function hideModalStatus() {
  modalStatusMsg.classList.add("hidden");
}

openM3uModalBtn.addEventListener("click", openModal);
closeM3uModalBtn.addEventListener("click", closeModal);

// Close modal when clicking on backdrop
m3uModal.addEventListener("click", (e) => {
  if (e.target === m3uModal) closeModal();
});

// Helper: fetch M3U text using own serverless proxy first, then external proxies as fallback
async function fetchTextWithProxy(url) {
  const targets = [
    `/api/proxy?url=${encodeURIComponent(url)}`, // 1. Own Vercel serverless proxy (best)
    url, // 2. Direct fetch (works for CORS-friendly URLs or local dev)
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`, // 3. AllOrigins fallback
  ];

  for (const target of targets) {
    try {
      const response = await fetch(target);
      if (response.ok) {
        const text = await response.text();
        if (text && (text.includes("#EXTM3U") || text.includes("#EXTINF"))) {
          return text;
        }
      }
    } catch (e) {
      console.warn(`Fetch failed: ${target}`, e);
    }
  }

  throw new Error(
    "No se pudo acceder a la lista M3U. Verifica la URL o que el servidor permita acceso externo.",
  );
}

// Load playlist function from custom URL or default
async function loadPlaylist(targetUrl, isExternal = false) {
  try {
    const textData = await fetchTextWithProxy(targetUrl);

    const parsedChannels = parseM3U(textData);
    if (parsedChannels.length === 0) {
      throw new Error(
        "No se detectaron canales válidos en el listado cargado.",
      );
    }

    // Replace channels and update UI
    channels = parsedChannels;
    activeChannelIndex = -1;
    updateGroupDropdown(channels);
    renderChannels(channels);

    if (channels.length > 0) {
      playChannel(0);
    }

    return { success: true, count: channels.length };
  } catch (err) {
    console.error("Error al cargar playlist:", err);
    return { success: false, error: err.message };
  }
}

// Submit custom external M3U
submitM3uBtn.addEventListener("click", async () => {
  const inputUrl = m3uUrlInput.value.trim();
  if (!inputUrl) {
    showModalStatus("Por favor ingresa una URL de listado M3U válida.");
    return;
  }

  // Set UI loading state
  submitM3uBtn.disabled = true;
  submitBtnSpinner.classList.remove("hidden");
  submitBtnText.textContent = "Verificando...";
  hideModalStatus();

  const result = await loadPlaylist(inputUrl, true);

  submitM3uBtn.disabled = false;
  submitBtnSpinner.classList.add("hidden");
  submitBtnText.textContent = "Cargar Listado";

  if (result.success) {
    showModalStatus(
      `¡Listado cargado con éxito! Se importaron ${result.count} canales.`,
      "success",
    );
    setTimeout(() => {
      closeModal();
    }, 1500);
  } else {
    showModalStatus(
      `Posible falla en el listado externo: ${result.error}. Verifica que la URL esté activa y permita acceso CORS.`,
    );
  }
});

// Reset to default repository list
resetDefaultM3uBtn.addEventListener("click", async () => {
  m3uUrlInput.value = "";
  hideModalStatus();
  await loadPlaylist(M3U_URL, false);
  closeModal();
});

// Fetch M3U List on start (always load default repository list on page refresh)
async function initApp() {
  await loadPlaylist(M3U_URL, false);
}

initApp();
