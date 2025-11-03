# fix-scss.ps1
$scssFiles = Get-ChildItem -Path "src/app/shared/ui-library/components" -Filter "*.scss" -Recurse

foreach ($file in $scssFiles) {
  $content = Get-Content $file.FullName -Raw
  
  # Aggiungi l'import se non c'è già
  if ($content -notmatch "@use.*mixins") {
    $newContent = "@use '../../../styles/mixins' as m;`r`n`r`n" + $content
    Set-Content -Path $file.FullName -Value $newContent
    Write-Host "✅ Aggiunto @use a: $($file.Name)"
  }
  
  # Sostituisci @include elevation() con @include m.elevation()
  $newContent = $content -replace "@include elevation", "@include m.elevation"
  $newContent = $newContent -replace "@include focus-ring", "@include m.focus-ring"
  
  Set-Content -Path $file.FullName -Value $newContent
}

Write-Host "✅ Riparazione completata!"
