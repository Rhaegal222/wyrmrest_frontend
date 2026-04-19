<# 
.SYNOPSIS
  Concatena i file Dart della cartella "lib/app" in un singolo file e aggiunge tree della directory.
.DESCRIPTION
  Scansiona ricorsivamente lib/app, raccoglie i file *.dart (ordinati per percorso),
  opzionalmente esclude i generati (*.g.dart, *.freezed.dart), e produce un unico file
  con separatori e header per ogni sorgente incluso.
  Alla fine aggiunge un albero della struttura directory con "tree /a /f".
.PARAMETER SourceDir
  Directory sorgente (default: lib/app).
.PARAMETER OutFile
  File di output (default: app_bundle.dart nella root del repo).
.PARAMETER Include
  Pattern di include (default: *.dart). Puoi passare più pattern.
.PARAMETER Exclude
  Pattern di esclusione aggiuntivi. (I generati sono esclusi di default).
.PARAMETER IncludeGenerated
  Se presente, NON esclude *.g.dart e *.freezed.dart.
.PARAMETER VerbosePaths
  Se presente, stampa a video i file inclusi.
.PARAMETER SkipTree
  Se presente, NON aggiunge l'output di tree alla fine.
.EXAMPLE
  .\pack-app.ps1
.EXAMPLE
  .\pack-app.ps1 -SourceDir lib\app -OutFile build\app_all.dart -IncludeGenerated
.EXAMPLE
  .\pack-app.ps1 -Exclude "*\generated\*" -VerbosePaths
.EXAMPLE
  .\pack-app.ps1 -SkipTree
#>

[CmdletBinding()]
param(
  [string]$SourceDir = ".\src",
  [string]$OutFile = "src.txt",
  [string[]]$Include = @("*.ts", "*.html", "*.scss", "*.css", "*.json", "*.md", "*.txt"),
  [string[]]$Exclude = @(".spec.ts", ".module.ts"),
  [switch]$IncludeGenerated,
  [switch]$VerbosePaths,
  [switch]$SkipTree
)

function Resolve-RepoPath([string]$Path) {
  if ([System.IO.Path]::IsPathRooted($Path)) { return $Path }
  return (Join-Path -Path (Get-Location) -ChildPath $Path)
}

try {
  $src = Resolve-RepoPath $SourceDir
  if (-not (Test-Path $src)) {
    throw "SourceDir non trovato: $src"
  }

  $out = Resolve-RepoPath $OutFile
  $outDir = Split-Path -Parent $out
  if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

  # Esclusioni di default (generati), rimuovibili con -IncludeGenerated
  $defaultExcludes = @()
  if (-not $IncludeGenerated) { 
    $defaultExcludes = @("*.g.dart", "*.freezed.dart") 
  }

  # Costruisci lista file
  $files = Get-ChildItem -Path $src -Recurse -File -Include $Include |
  Where-Object {
    $name = $_.Name
    # escludi default generati
    if ($defaultExcludes | Where-Object { $name -like $_ }) { return $false }
    # escludi pattern custom
    if ($Exclude.Count -gt 0) {
      if ($Exclude | Where-Object { $_ -and ($_.Trim()) -and ($_.Contains('\')) }) {
        # pattern con separatori: confronta FullName
        if ($Exclude | Where-Object { 
            $_ -and 
            ($_.Trim()) -and 
            ($_.ToString() -ne "") -and 
            ($_.ToString() -match '[\\/]') -and 
            ($_.ToString() -ne "*") -and 
            ($_.ToString() -ne ".*") -and 
            ($_.ToString() -ne "*.dart") -and 
            ($_.ToString() -ne "*.g.dart") -and 
            ($_.ToString() -ne "*.freezed.dart") -and 
            ($_.ToString() -ne "*.*") 
          } | ForEach-Object { $_ }) {
          foreach ($pat in $Exclude) {
            if ($_.FullName -like $pat) { return $false }
          }
        }
      }
      # pattern semplici: confronta Name
      foreach ($pat in $Exclude) {
        if ($name -like $pat) { return $false }
      }
    }
    return $true
  } |
  Sort-Object FullName

  if ($files.Count -eq 0) {
    throw "Nessun file trovato in $src con include: $($Include -join ', ')"
  }

  # Header del bundle
  $header = @()
  $header += "// GENERATED BUNDLE — DO NOT EDIT BY HAND"
  $header += "// Source: $SourceDir"
  $header += "// Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
  $header += "// Files: $($files.Count)"
  $header += ""
  $headerText = ($header -join "`r`n") + "`r`n"

  Set-Content -Path $out -Value $headerText -Encoding UTF8

  # Aggiungi contenuto file
  foreach ($f in $files) {
    $rel = Resolve-Path -LiteralPath $f.FullName | ForEach-Object {
      $_.Path.Replace((Resolve-Path -LiteralPath (Get-Location)).Path + [IO.Path]::DirectorySeparatorChar, "")
    }
    if ($VerbosePaths) { Write-Host " + $rel" -ForegroundColor Green }

    $sep = @()
    $sep += "`r`n// ================================================================"
    $sep += "// FILE: $rel"
    $sep += "// ================================================================"
    $sep += ""
    Add-Content -Path $out -Value ($sep -join "`r`n") -Encoding UTF8

    $content = Get-Content -LiteralPath $f.FullName -Raw
    Add-Content -Path $out -Value $content -Encoding UTF8
    Add-Content -Path $out -Value "`r`n" -Encoding UTF8
  }

  Write-Host "✅ Bundle creato: $out ($($files.Count) file)" -ForegroundColor Green

  # Aggiungi tree della directory alla fine
  if (-not $SkipTree) {
    Write-Host "📂 Generazione tree della directory..." -ForegroundColor Cyan
    
    $treeSeparator = @()
    $treeSeparator += "`r`n"
    $treeSeparator += "// ================================================================"
    $treeSeparator += "// DIRECTORY TREE"
    $treeSeparator += "// ================================================================"
    $treeSeparator += "// Generato con: tree /a /f"
    $treeSeparator += "// Directory: $SourceDir"
    $treeSeparator += "// Data: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    $treeSeparator += "// ================================================================"
    $treeSeparator += ""
    
    Add-Content -Path $out -Value ($treeSeparator -join "`r`n") -Encoding UTF8
    
    try {
      # Esegui tree command
      Push-Location $src
      $treeOutput = & cmd /c "tree /a /f 2>&1"
      Pop-Location
      
      # Converti output in formato commentato
      $treeLines = $treeOutput -split "`r?`n" | ForEach-Object {
        if ($_.Trim() -ne "") {
          "// $_"
        }
      }
      
      Add-Content -Path $out -Value ($treeLines -join "`r`n") -Encoding UTF8
      Add-Content -Path $out -Value "`r`n// ================================================================" -Encoding UTF8
      
      Write-Host "✅ Tree aggiunto al bundle" -ForegroundColor Green
      
    }
    catch {
      Write-Warning "⚠️ Impossibile eseguire tree command: $_"
      Add-Content -Path $out -Value "// ERRORE: tree command non disponibile o fallito" -Encoding UTF8
    }
  }

  Write-Host "`n🎉 Processo completato con successo!" -ForegroundColor Cyan
  Write-Host "   File output: $out" -ForegroundColor Gray
  Write-Host "   Dimensione: $([math]::Round((Get-Item $out).Length / 1KB, 2)) KB" -ForegroundColor Gray
}
catch {
  Write-Error "❌ Errore: $_"
  exit 1
}
