package com.solareum; // Change this to your package name.
import android.content.Intent;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import android.net.Uri;
import com.solareum.MainActivity;

public class SplashActivity extends AppCompatActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    Intent intent = new Intent(this, MainActivity.class);
    String action = intent.getAction();
    Uri data = intent.getData();
    startActivity(intent);
    finish();
  }
  @Override
  protected void onNewIntent(final Intent intent) {
      super.onNewIntent(intent);
      setIntent(intent);

  }
}
