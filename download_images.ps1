$base_url = "https://Mypa.it/images/prodotti/"
$images = @(
    "GB-KB", "GBE-KBE", "GBE-LE", "GBW-KBW", "P-K", "PE-KE", "PN",
    "AG", "AN", "G", "N-NR", "ITP", "ITV", "ITVH", "ITR", "ITRV",
    "ITRP", "ITRE", "ITM", "PT", "ITG", "ITGS"
)

foreach ($img in $images) {
    $url = "$base_url$img.jpg"
    $dest = "public/images/products/$img.jpg"
    Write-Host "Downloading $url..."
    try {
        curl.exe -s -L $url -o $dest
    } catch {
        Write-Host "Failed to download $url"
    }
}

