from abc import ABC, abstractmethod

class STTProvider(ABC):
    """Any Speech-to-Text provider (e.g. AI4Bharat, Google STT) must implement this."""

    @abstractmethod
    def transcribe(self, audio_bytes: bytes) -> str:
        """Takes raw audio, returns the transcribed text."""
        pass


class TTSProvider(ABC):
    """Any Text-to-Speech provider (e.g. AI4Bharat, ElevenLabs) must implement this."""

    @abstractmethod
    def synthesize(self, text: str) -> bytes:
        """Takes text, returns raw audio bytes."""
        pass


class TelephonyProvider(ABC):
    """Any telephony provider (e.g. Exotel, Twilio) must implement this."""

    @abstractmethod
    def make_call(self, phone_number: str) -> str:
        """Initiates a call, returns a call ID/session reference."""
        pass

    @abstractmethod
    def end_call(self, call_id: str) -> None:
        """Ends an active call."""
        pass


class MockSTTProvider(STTProvider):
    """Placeholder STT for testing, before real AI4Bharat integration."""

    def transcribe(self, audio_bytes: bytes, simulated_text: str = None) -> str:
        if simulated_text:
            return simulated_text
        return "This is a mock transcript for testing purposes."


class MockTTSProvider(TTSProvider):
    """Placeholder TTS for testing, before real AI4Bharat integration."""

    def synthesize(self, text: str) -> bytes:
        return b"mock-audio-bytes"


class MockTelephonyProvider(TelephonyProvider):
    """Placeholder telephony for testing, before real Exotel integration."""

    def make_call(self, phone_number: str) -> str:
        return "mock-call-id-12345"

    def end_call(self, call_id: str) -> None:
        pass